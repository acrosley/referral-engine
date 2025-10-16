# financial_sensitivity_model_public.py
import math
import warnings
from io import BytesIO
from PIL import Image

import gradio as gr
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend for public sharing
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

# Suppress matplotlib warnings for cleaner public output
warnings.filterwarnings('ignore', category=UserWarning, module='matplotlib')


def kpis(
    ad_spend,
    qualified_leads,
    keepers_input_mode,
    keepers_count,
    lead_to_keeper_rate,
    avg_settlement,
    contingency_pct,
    referral_fee_pct,
    variable_cost_per_lead,
    fixed_overhead,
    desired_roi_pct,
    x_axis_max,
    # Time-based parameters
    months_in_operation,
    avg_case_duration_months,
    case_resolution_probability,
    tier_1_pct,
    tier_2_pct,
    tier_3_pct,
):
    """Calculate financial KPIs and generate charts with input validation."""
    try:
        # Input validation and sanitization for public use
        if ad_spend is None or qualified_leads is None or keepers_count is None:
            return "Error: Please fill in all required fields.", None, None
        
        # Ensure all inputs are within reasonable bounds for public safety
        ad_spend = max(0.0, min(float(ad_spend or 0), 100000))  # Cap at $100k
        qualified_leads = max(0, min(int(qualified_leads or 0), 1000))  # Cap at 1000 leads
        keepers_count = max(0, min(int(keepers_count or 0), 500))  # Cap at 500 keepers
        lead_to_keeper_rate = max(0.0, min(float(lead_to_keeper_rate or 0), 100.0))
        avg_settlement = max(0.0, min(float(avg_settlement or 0), 1000000))  # Cap at $1M
        contingency_pct = max(0.0, min(float(contingency_pct or 0), 100.0))
        referral_fee_pct = max(0.0, min(float(referral_fee_pct or 0), 100.0))
        variable_cost_per_lead = max(0.0, min(float(variable_cost_per_lead or 0), 1000))  # Cap at $1k
        fixed_overhead = max(0.0, min(float(fixed_overhead or 0), 50000))  # Cap at $50k
        desired_roi_pct = max(0.0, min(float(desired_roi_pct or 0), 1000))  # Cap at 1000%
        x_axis_max = max(0, min(int(x_axis_max or 0), 1000))  # Cap at 1000 for performance
        
        # Time-based parameter validation
        months_in_operation = max(0, min(int(months_in_operation or 0), 120))  # Cap at 10 years
        avg_case_duration_months = max(1.0, min(float(avg_case_duration_months or 12), 60))  # Cap at 5 years
        case_resolution_probability = max(0.0, min(float(case_resolution_probability or 85), 100.0))
        tier_1_pct = max(0.0, min(float(tier_1_pct or 40), 100.0))
        tier_2_pct = max(0.0, min(float(tier_2_pct or 40), 100.0))
        tier_3_pct = max(0.0, min(float(tier_3_pct or 20), 100.0))
        
    except (ValueError, TypeError) as e:
        return f"Error: Invalid input values. Please check your inputs. ({str(e)})", None, None
    
    # Normalize
    contingency = contingency_pct / 100.0
    referral_fee = referral_fee_pct / 100.0
    desired_roi = desired_roi_pct / 100.0

    # Determine keepers
    if keepers_input_mode == "Direct entry":
        keepers = max(0, int(keepers_count))
    else:
        rate = max(0.0, min(1.0, lead_to_keeper_rate / 100.0))
        keepers = int(round(rate * max(0, int(qualified_leads))))

    qualified_leads = max(0, int(qualified_leads))
    ad_spend = max(0.0, float(ad_spend))
    avg_settlement = max(0.0, float(avg_settlement))
    variable_cpl = max(0.0, float(variable_cost_per_lead))
    fixed_overhead = max(0.0, float(fixed_overhead))

    # Economics
    avg_referral_fee_per_case = avg_settlement * contingency * referral_fee
    gross_revenue = keepers * avg_referral_fee_per_case
    variable_cost_total = qualified_leads * variable_cpl
    total_costs = ad_spend + variable_cost_total + fixed_overhead
    net_profit = gross_revenue - total_costs
    roi = (net_profit / total_costs) if total_costs > 0 else 0.0

    cpk = (total_costs / keepers) if keepers > 0 else float("inf")
    lead_to_keeper_ratio = (keepers / qualified_leads) if qualified_leads > 0 else 0.0
    breakeven_keepers = (
        math.ceil(total_costs / avg_referral_fee_per_case)
        if avg_referral_fee_per_case > 0
        else None
    )

    allowed_costs_for_target_roi = (
        gross_revenue / (1 + desired_roi) if (1 + desired_roi) > 0 else None
    )
    remaining_for_ads = (
        allowed_costs_for_target_roi - variable_cost_total - fixed_overhead
        if allowed_costs_for_target_roi is not None
        else None
    )

    # ===== TIME-BASED MARGIN KPIs =====
    months_in_operation = max(0, int(months_in_operation))
    avg_case_duration_months = max(1, float(avg_case_duration_months))
    case_resolution_probability = max(0.0, min(1.0, case_resolution_probability / 100.0))
    
    # Normalize tier percentages
    tier_1_pct = max(0.0, min(100.0, float(tier_1_pct)))
    tier_2_pct = max(0.0, min(100.0, float(tier_2_pct)))
    tier_3_pct = max(0.0, min(100.0, float(tier_3_pct)))
    tier_total = tier_1_pct + tier_2_pct + tier_3_pct
    if tier_total > 0:
        tier_1_pct = (tier_1_pct / tier_total) * 100
        tier_2_pct = (tier_2_pct / tier_total) * 100
        tier_3_pct = (tier_3_pct / tier_total) * 100
    
    # Calculate cumulative costs over months
    cumulative_monthly_costs = total_costs * months_in_operation
    
    # 1. Deferred Revenue Pipeline
    # Cumulative value of cases expected to resolve within 6-36 months
    total_keepers_accumulated = keepers * months_in_operation
    deferred_revenue_pipeline = total_keepers_accumulated * avg_referral_fee_per_case * case_resolution_probability
    
    # 2. 12-Month Weighted ROI
    # ROI normalized by case duration: (Referral Fee Income) / (Cost × (Months/12))
    duration_weight = avg_case_duration_months / 12.0
    twelve_month_weighted_roi = (
        (gross_revenue / (total_costs * duration_weight)) if (total_costs * duration_weight) > 0 else 0.0
    )
    
    # 3. Cash Flow Coverage Ratio
    # Ratio of monthly referral income received vs. monthly marketing spend
    # Estimate realized income based on cases that have matured
    months_to_realization = avg_case_duration_months
    if months_in_operation >= months_to_realization:
        realized_months = months_in_operation - months_to_realization
        realized_keepers = keepers * realized_months
        monthly_referral_income = (realized_keepers * avg_referral_fee_per_case * case_resolution_probability) / max(1, months_in_operation)
    else:
        monthly_referral_income = 0
    
    cash_flow_coverage_ratio = (
        monthly_referral_income / ad_spend if ad_spend > 0 else 0.0
    )
    
    # 4. Case Maturity Distribution
    case_maturity_distribution = f"{tier_1_pct:.0f}% / {tier_2_pct:.0f}% / {tier_3_pct:.0f}%"
    
    # 5. Realized Referral Margin (RRM)
    # (Received referral fees − cumulative acquisition costs) ÷ acquisition costs
    received_referral_fees = monthly_referral_income * months_in_operation
    rrm = (
        ((received_referral_fees - cumulative_monthly_costs) / cumulative_monthly_costs)
        if cumulative_monthly_costs > 0 else 0.0
    )
    
    # 6. Adjusted Lifetime ROI (ALROI)
    # ROI over rolling 36-month window including unresolved cases (forecasted value weighted by probability)
    window_months = min(36, months_in_operation)
    total_expected_value = total_keepers_accumulated * avg_referral_fee_per_case * case_resolution_probability
    window_costs = total_costs * window_months
    alroi = (
        ((total_expected_value - window_costs) / window_costs)
        if window_costs > 0 else 0.0
    )
    
    # 7. Capital Lockup Period
    # Average time between ad spend and first referral payout (approximated by case duration)
    capital_lockup_period = avg_case_duration_months

    def Cash(x):
        if x is None:
            return "—"
        if x == float("inf"):
            return "∞"
        return f"${x:,.0f}"

    kpi = f"""KPIs
-------------
Qualified Leads: {qualified_leads:,}
Keepers (signed cases): {keepers:,}
Lead → Keeper Rate: {lead_to_keeper_ratio*100:,.1f}%

Avg Settlement: {Cash(avg_settlement)}
Contingency %: {contingency_pct:.1f}%
Referral Fee %: {referral_fee_pct:.1f}%
Avg Referral Fee / Keeper: {Cash(avg_referral_fee_per_case)}

Ad Spend: {Cash(ad_spend)}
Other Variable Costs (Leads × ${variable_cpl:,.0f}): {Cash(variable_cost_total)}
Fixed Overhead: {Cash(fixed_overhead)}
Total Costs: {Cash(total_costs)}

Gross Revenue (Keepers × Avg Referral Fee): {Cash(gross_revenue)}
Net Profit: {Cash(net_profit)}
ROI (Net ÷ Costs): {roi*100:,.1f}%

CPK (Total Costs ÷ Keepers): {Cash(cpk)}
Breakeven Keepers (Net=0): {"—" if breakeven_keepers is None else f"{breakeven_keepers:,}"}

Target ROI: {desired_roi_pct:.1f}%
Max Allowed Total Costs for Target ROI: {Cash(allowed_costs_for_target_roi)}
Max Ad Spend for Target ROI (given other costs): {Cash(remaining_for_ads)}

TIME-BASED MARGIN KPIs (6–36 Month Lifecycle)
---------------------------------------------
Months in Operation: {months_in_operation}
Avg Case Duration: {avg_case_duration_months:.1f} months
Case Resolution Probability: {case_resolution_probability*100:.1f}%

Deferred Revenue Pipeline: {Cash(deferred_revenue_pipeline)}
    Target: $250,000+ after 6 months

12-Month Weighted ROI: {twelve_month_weighted_roi:.2f}×
    Target: ≥ 1.5× at 12 months

Cash Flow Coverage Ratio: {cash_flow_coverage_ratio:.2f}×
    Target: 0.5× at 6 months → 2.0× by month 18

Case Maturity Distribution (6-12 / 12-24 / 24-36 months): {case_maturity_distribution}
    Target: 40% / 40% / 20% split by volume

Realized Referral Margin (RRM): {rrm*100:+.1f}%
    Target: +25% by month 12; +200% by month 36

Adjusted Lifetime ROI (ALROI): {alroi:.2f}×
    Target: ≥ 4× within 3 years

Capital Lockup Period: {capital_lockup_period:.1f} months
    Target: ≤ 12 months median
"""

    # ----- Plots -----
    # X-axis range (auto vs manual) - focus on relevant data range
    if x_axis_max and int(x_axis_max) > 0:
        xmax = max(1, int(x_axis_max))
    else:
        # Focus on data around current position and breakeven
        key_points = [keepers, breakeven_keepers or 0, qualified_leads]
        max_relevant = max([p for p in key_points if p > 0] + [5])  # at least 5 for visibility
        xmax = max(20, int(max_relevant * 1.5))  # 1.5x buffer around relevant data

    ks = list(range(0, xmax + 1))
    nets = []
    rois = []
    for k in ks:
        gross_k = k * avg_referral_fee_per_case
        net_k = gross_k - total_costs
        nets.append(net_k)
        rois.append((net_k / total_costs) if total_costs > 0 else 0.0)

    # Net Profit chart
    fig1, ax1 = plt.subplots(figsize=(10, 6), dpi=100)
    ax1.plot(ks, nets, linewidth=2.5, color='#2E86AB', label='Net Profit')
    ax1.axhline(0, color='black', linewidth=1.5, linestyle='-', alpha=0.3)
    cur_net = keepers * avg_referral_fee_per_case - total_costs
    ax1.axvline(keepers, color='green', linewidth=2, linestyle='-', alpha=0.5, label='Current')
    ax1.plot([keepers], [cur_net], marker="o", markersize=10, color='green', zorder=5)
    
    if breakeven_keepers is not None and math.isfinite(breakeven_keepers) and breakeven_keepers <= xmax:
        ax1.axvline(breakeven_keepers, linestyle="--", linewidth=2, color='orange', alpha=0.7, label='Breakeven')
        ax1.plot([breakeven_keepers], [0], marker="s", markersize=8, color='orange', zorder=5)
        # Smart annotation positioning for breakeven
        be_x_offset = 10 if breakeven_keepers < xmax * 0.9 else -10
        be_ha = 'left' if breakeven_keepers < xmax * 0.9 else 'right'
        ax1.annotate(
            f"Breakeven: {breakeven_keepers}",
            xy=(breakeven_keepers, 0),
            xytext=(be_x_offset, 15),
            textcoords="offset points",
            ha=be_ha,
            fontsize=10,
            bbox=dict(boxstyle='round,pad=0.5', facecolor='orange', alpha=0.2),
        )
    
    # Smart annotation positioning for current point
    cur_x_offset = 10 if keepers < xmax * 0.85 else -10
    cur_ha = 'left' if keepers < xmax * 0.85 else 'right'
    cur_y_offset = 20 if cur_net >= 0 else -30
    ax1.annotate(
        f"K={keepers}\nNet=${cur_net:,.0f}",
        xy=(keepers, cur_net),
        xytext=(cur_x_offset, cur_y_offset),
        textcoords="offset points",
        ha=cur_ha,
        fontsize=10,
        bbox=dict(boxstyle='round,pad=0.5', facecolor='green', alpha=0.2),
    )
    
    ax1.fill_between(ks, nets, 0, where=[n >= 0 for n in nets], alpha=0.15, color='green', label='Profit')
    ax1.fill_between(ks, nets, 0, where=[n < 0 for n in nets], alpha=0.15, color='red', label='Loss')
    ax1.set_title("Net Profit vs Keepers", fontsize=14, fontweight='bold', pad=20)
    ax1.set_xlabel("Keepers (signed cases)", fontsize=12, fontweight='bold')
    ax1.set_ylabel("Net Profit ($)", fontsize=12, fontweight='bold')
    ax1.grid(True, which="both", linestyle=":", linewidth=0.5, alpha=0.6)
    ax1.yaxis.set_major_formatter(FuncFormatter(lambda x, pos: f"${x/1000:.0f}K" if abs(x) >= 1000 else f"${x:.0f}"))
    
    # Improved y-axis scaling - focus on relevant range
    relevant_nets = nets[:xmax+1]  # Only plot up to our xmax
    ymin = min(0, min(relevant_nets))
    ymax = max(0, max(relevant_nets))
    
    # If current point is near zero, expand range to show more context
    current_net = nets[keepers] if keepers <= xmax else 0
    if abs(current_net) < 1000:  # If current profit is small
        ymax = max(ymax, 10000)  # Show at least $10K range
        ymin = min(ymin, -5000)  # Show some negative range
    
    y_range = ymax - ymin
    ypad = max(abs(y_range) * 0.15, 1000) if y_range != 0 else 1000
    ax1.set_ylim(ymin - ypad, ymax + ypad)
    ax1.set_xlim(-xmax * 0.02, xmax * 1.02)
    
    ax1.legend(loc='best', framealpha=0.9, fontsize=9)
    fig1.tight_layout()
    buf1 = BytesIO()
    fig1.savefig(buf1, format="png", dpi=100, bbox_inches="tight")
    plt.close(fig1)
    buf1.seek(0)
    img1 = Image.open(buf1)

    # ROI chart
    fig2, ax2 = plt.subplots(figsize=(10, 6), dpi=100)
    roi_values = [r * 100 for r in rois]
    ax2.plot(ks, roi_values, linewidth=2.5, color='#A23B72', label='ROI')
    ax2.axhline(0, color='black', linewidth=1.5, linestyle='-', alpha=0.3)
    ax2.axhline(desired_roi * 100, linestyle="--", linewidth=2, color='#F18F01', alpha=0.7, label='Target ROI')
    
    # Target ROI annotation
    target_y_pos = desired_roi * 100
    ax2.annotate(
        f"Target: {desired_roi*100:.0f}%",
        xy=(xmax * 0.02, target_y_pos),
        xytext=(0, 8),
        textcoords="offset points",
        fontsize=10,
        bbox=dict(boxstyle='round,pad=0.5', facecolor='#F18F01', alpha=0.2),
    )
    
    current_roi_val = (cur_net / total_costs) * 100 if total_costs > 0 else 0
    ax2.axvline(keepers, color='green', linewidth=2, linestyle='-', alpha=0.5, label='Current')
    ax2.plot([keepers], [current_roi_val], marker="o", markersize=10, color='green', zorder=5)
    
    # Smart annotation for current position
    cur_x_offset_roi = 10 if keepers < xmax * 0.85 else -10
    cur_ha_roi = 'left' if keepers < xmax * 0.85 else 'right'
    ax2.annotate(
        f"K={keepers}\nROI={current_roi_val:.1f}%", 
        xy=(keepers, current_roi_val), 
        xytext=(cur_x_offset_roi, 20), 
        textcoords="offset points",
        ha=cur_ha_roi,
        fontsize=10,
        bbox=dict(boxstyle='round,pad=0.5', facecolor='green', alpha=0.2),
    )
    
    ax2.set_title("ROI vs Keepers", fontsize=14, fontweight='bold', pad=20)
    ax2.set_xlabel("Keepers (signed cases)", fontsize=12, fontweight='bold')
    ax2.set_ylabel("ROI (%)", fontsize=12, fontweight='bold')
    ax2.grid(True, which="both", linestyle=":", linewidth=0.5, alpha=0.6)
    ax2.yaxis.set_major_formatter(FuncFormatter(lambda x, pos: f"{x:.0f}%"))
    
    # Improved y-axis scaling for ROI - focus on relevant range
    relevant_rois = roi_values[:xmax+1]  # Only plot up to our xmax
    ymin2 = min(0, min(relevant_rois))
    ymax2 = max(0, max(relevant_rois), desired_roi * 100)
    
    # If current ROI is small, don't extend too far
    current_roi_val = (cur_net / total_costs) * 100 if total_costs > 0 else 0
    if current_roi_val < 50:  # If current ROI is less than 50%
        ymax2 = max(ymax2, 100)  # Cap at 100% unless target is higher
        if desired_roi * 100 > 100:
            ymax2 = desired_roi * 100 * 1.2  # 20% buffer above target
    
    y_range2 = ymax2 - ymin2
    ypad2 = max(abs(y_range2) * 0.15, 10) if y_range2 != 0 else 10
    ax2.set_ylim(ymin2 - ypad2, ymax2 + ypad2)
    ax2.set_xlim(-xmax * 0.02, xmax * 1.02)
    
    ax2.legend(loc='best', framealpha=0.9, fontsize=9)
    fig2.tight_layout()
    buf2 = BytesIO()
    fig2.savefig(buf2, format="png", dpi=100, bbox_inches="tight")
    plt.close(fig2)
    buf2.seek(0)
    img2 = Image.open(buf2)

    return kpi, img1, img2


with gr.Blocks(
    title="Financial Sensitivity Model - Public Demo",
    theme=gr.themes.Soft(),
    css="""
    .gradio-container {
        max-width: 1200px !important;
        margin: auto !important;
    }
    .warning {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        padding: 10px;
        border-radius: 5px;
        margin: 10px 0;
    }
    """
) as demo:
    gr.Markdown("# 📊 Financial Sensitivity Model - Public Demo")
    gr.Markdown("""
    **Disclaimer:** This is a demonstration tool for educational purposes. 
    Adjust inputs and click **Calculate** to update KPIs and charts.
    
    ⚠️ **Input Limits:** Values are capped for public safety and performance.
    """)
    
    with gr.Row():
        gr.Markdown("""
        <div class="warning">
        <strong>Note:</strong> This tool is for demonstration purposes only. 
        All calculations are estimates and should not be used for actual business decisions.
        </div>
        """)

    with gr.Row():
        with gr.Column(scale=85):
            ad_spend = gr.Number(label="Monthly Ad Spend ($)", value=9000, precision=0, maximum=100000, info="Max: $100,000")
            qualified_leads = gr.Number(label="Qualified Leads (per month)", value=60, precision=0, maximum=1000, info="Max: 1,000")

            keepers_input_mode = gr.Radio(
                ["Direct entry", "From rate (%)"],
                value="Direct entry",
                label="Keepers Input Mode",
            )
            keepers_count = gr.Number(label="Keepers (signed cases)", value=5, precision=0, visible=True, maximum=500, info="Max: 500")
            lead_to_keeper_rate = gr.Slider(
                label="Lead→Keeper Rate (%)", value=8.0, minimum=0.0, maximum=100.0, step=0.1, visible=False
            )

            avg_settlement = gr.Number(label="Average Settlement ($)", value=36000, precision=0, maximum=1000000, info="Max: $1,000,000")
            contingency_pct = gr.Slider(label="Contingency Percentage (%)", value=33.3, minimum=10.0, maximum=45.0, step=0.1)
            referral_fee_pct = gr.Slider(label="Referral Fee Percentage (%)", value=25.0, minimum=5.0, maximum=40.0, step=0.1)

            variable_cost_per_lead = gr.Number(
                label="Other Variable Cost per Lead ($)", value=25, precision=0, maximum=1000, info="Max: $1,000"
            )
            fixed_overhead = gr.Number(
                label="Fixed Overhead ($/month)", value=1500, precision=0, maximum=50000, info="Max: $50,000"
            )
            desired_roi_pct = gr.Slider(label="Target ROI (%)", value=100.0, minimum=0.0, maximum=1000.0, step=5.0, info="Max: 1000%")
            x_axis_max = gr.Number(label="X-axis max keepers (0 = auto)", value=0, precision=0, maximum=1000, info="Max: 1000")

            gr.Markdown("### Time-Based Parameters")
            months_in_operation = gr.Number(label="Months in Operation", value=12, precision=0, maximum=120, info="Max: 120 months")
            avg_case_duration_months = gr.Slider(label="Average Case Duration (months)", value=12.0, minimum=6.0, maximum=60.0, step=1.0, info="Max: 60 months")
            case_resolution_probability = gr.Slider(label="Case Resolution Probability (%)", value=85.0, minimum=0.0, maximum=100.0, step=1.0)
            
            with gr.Accordion("Case Maturity Distribution", open=False):
                tier_1_pct = gr.Slider(label="Resolves within 6-12 months (%)", value=40.0, minimum=0.0, maximum=100.0, step=1.0)
                tier_2_pct = gr.Slider(label="Resolves within 12-24 months (%)", value=40.0, minimum=0.0, maximum=100.0, step=1.0)
                tier_3_pct = gr.Slider(label="Resolves within 24-36 months (%)", value=20.0, minimum=0.0, maximum=100.0, step=1.0)

            calc = gr.Button("Calculate / Update")

        with gr.Column(scale=115):
            kpi_out = gr.Textbox(label="Results", lines=42)
            plot_out = gr.Image(label="Net Profit Curve", interactive=False)
            roi_plot_out = gr.Image(label="ROI vs Keepers", interactive=False)

    def _toggle(mode):
        return gr.update(visible=(mode == "Direct entry")), gr.update(visible=(mode != "Direct entry"))

    keepers_input_mode.change(
        fn=_toggle,
        inputs=keepers_input_mode,
        outputs=[keepers_count, lead_to_keeper_rate],
    )

    calc.click(
        fn=kpis,
        inputs=[
            ad_spend,
            qualified_leads,
            keepers_input_mode,
            keepers_count,
            lead_to_keeper_rate,
            avg_settlement,
            contingency_pct,
            referral_fee_pct,
            variable_cost_per_lead,
            fixed_overhead,
            desired_roi_pct,
            x_axis_max,
            months_in_operation,
            avg_case_duration_months,
            case_resolution_probability,
            tier_1_pct,
            tier_2_pct,
            tier_3_pct,
        ],
        outputs=[kpi_out, plot_out, roi_plot_out],
    )
    
    # Footer with usage information
    with gr.Row():
        gr.Markdown("""
        ---
        **📚 How to Use:**
        1. Adjust the input parameters in the left column
        2. Click "Calculate / Update" to see results
        3. View KPIs in the results box and charts below
        
        **🔧 Tips:**
        - Use "Direct entry" for keepers or "From rate (%)" to calculate from leads
        - X-axis max of 0 uses automatic scaling
        - All values are capped for public safety and performance
        
        **⚠️ Disclaimer:** This tool is for demonstration purposes only.
        """)


if __name__ == "__main__":
    demo.launch(
        share=True,
        server_name="0.0.0.0",  # Allow external connections
        server_port=7860,       # Default Gradio port
        show_error=True,        # Show errors to users
        quiet=False            # Show startup messages
    )

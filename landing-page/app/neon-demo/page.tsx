import { neon } from '@neondatabase/serverless';

export default function NeonDemoPage() {
  async function create(formData: FormData) {
    'use server';
    // Connect to the Neon database
    const sql = neon(`${process.env.DATABASE_URL}`);
    const comment = formData.get('comment');
    // Insert the comment from the form into the Postgres database
    await sql('INSERT INTO comments (comment) VALUES ($1)', [comment]);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Neon Database Demo
          </h1>
          <p className="text-gray-600 mb-6">
            This form demonstrates the Neon serverless driver integration. 
            Submit a comment to test the database connection.
          </p>
          <form action={create} className="space-y-4">
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Write a comment
              </label>
              <input 
                type="text" 
                id="comment"
                name="comment" 
                placeholder="Enter your comment here..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Submit Comment
            </button>
          </form>
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Database Setup Required:</h3>
            <p className="text-sm text-blue-700">
              Make sure to create the comments table in your Neon database:
            </p>
            <code className="block mt-2 text-xs bg-blue-100 p-2 rounded">
              CREATE TABLE IF NOT EXISTS comments (comment TEXT);
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function POST(request) {
    try {
      const body = await request.json();
      const { a, b } = body;
  
      const sum = Number(a) + Number(b);
  
      return new Response(JSON.stringify({ sum }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
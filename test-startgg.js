require('dotenv').config({ path: '.env.local' });



const query = `
  query Introspection {
    __type(name: "Team") {
      name
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
            fields {
                name
                type {
                    name
                    kind
                    ofType {
                        name
                    }
                }
            }
          }
        }
      }
    }
  }
`;

async function run() {
    const response = await fetch('https://api.start.gg/gql/alpha', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.STARTGG_API_KEY}`
        },
        body: JSON.stringify({ query })
    });

    const data = await response.json();
    const fs = require('fs');
    fs.writeFileSync('introspection.json', JSON.stringify(data, null, 2));
    console.log('Written to introspection.json');
}

run();

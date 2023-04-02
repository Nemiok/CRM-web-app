/* запрос клиентов */
export async function getClients(id = false) {
  const request = !id ? await fetch('http://localhost:3000/api/clients') : await fetch(`http://localhost:3000/api/clients/${id}`);
  const response = await request.json();
  return response;
}

/* создание клиента */
export async function createClientInDB(client) {
  await fetch('http://localhost:3000/api/clients', {
    method: 'POST',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

/* удалить клиента */
export async function deleteClientFromDB(id) {
  await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'DELETE',
  });
}

/* изменить клиента */
export async function editClientInDB(id, client) {
  await fetch(`http://localhost:3000/api/clients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(client),
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

import Link from 'next/link';
import redis from './utils/redis';

type User = {
  id: number;
  name: string;
};

async function getUsers(): Promise<User[]> {
  try {
    const data = await redis.get('users');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}

export default async function Home() {
  const users = await getUsers();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-white shadow rounded-lg p-4">
            <Link href={`/user/availability/${user.id}`} className="text-blue-500 hover:underline">
              {user.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

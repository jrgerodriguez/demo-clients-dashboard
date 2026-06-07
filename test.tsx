import { useState } from "react";

type User = {
  id: number, 
  name: string, 
  age: number
}

function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "Juan", age: 25 },
    { id: 2, name: "Maria", age: 30 },
  ]);

  const [search, setSearch] = useState("");

  const filtered = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <SearchInput search={search} setSearch={setSearch} />
      <UserList users={filtered} />
    </>
  );
}

type SearchInputProps  = {
  search: string;
  setSearch: (value: string) => void
}

function SearchInput({ search, setSearch }: SearchInputProps ) {
  return (
    <input
      value={search}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
    />
  );
}

type UserListProps = {
  users: User[];
}

function UserList({ users }: UserListProps) {
  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.age}
        </li>
      ))}
    </ul>
  );
}

export default UsersPage;
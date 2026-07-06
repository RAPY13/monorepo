import { createClient } from "@/utils/supabase/server";

export default async function Page() {
  const supabase = await createClient();

  const { data: todos, error } = await supabase.from("todos").select();

  if (error) {
    console.error(error);
  }

  return (
    <ul>
      {todos?.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}

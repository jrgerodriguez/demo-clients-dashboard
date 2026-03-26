import { supabase } from "@/lib/supabase";

export default async function Home() {

  const {data: clientes, error} = await supabase
  .from("clientes")
  .select("*")

  if (error) {
    console.error(error);
    return <p>Error loading clients</p>;
  }

  return (
    <div className="">
      <main className="">
        <pre>
          {JSON.stringify(clientes, null, 2)}
        </pre>
      </main>
    </div>
  );
}

import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Frontend Next.js</h1>

      <Link href="/mahasiswa">
        Buka Data Mahasiswa
      </Link>
    </main>
  );
}
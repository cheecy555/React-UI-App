import Link from 'next/link';
export default function NotFound() {


  return (
    <>
    <h1 className="text-4xl">Not found</h1>
      <div className="py-8">
        Back to{" "}
        <Link className="underline" href="/">
          front page
        </Link>
      </div>
    </>
  );
}

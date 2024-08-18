import Link from "next/link";

export default function Header() {
    return (
        <nav style={{ margin: "20px", marginBottom: "80px" }}>
            <h1>내 블로그 My Blog~ 私のブログです</h1>
            <Link href="/" style={{ margin: "20px" }}>
                Home
            </Link>
            <Link href="/about">About</Link>
        </nav>
    );
}

// app/about/page.js

export default function AboutPage() {
    return (
        <div>
            <h1>About Me</h1>
            <p>This is a brief introduction about me.</p>
            <p>
                Check out my GitHub:{" "}
                <a
                    href="https://github.com/yourusername"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    GitHub
                </a>
            </p>
        </div>
    );
}

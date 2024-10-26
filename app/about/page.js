// app/about/page.js

export default function AboutPage() {
    return (
        <div className="max-w-lg mx-auto my-10 bg-white rounded-lg shadow-md p-5">
            <img
                className="w-32 h-32 rounded-full mx-auto"
                src="https://avatars.githubusercontent.com/u/165984445?v=4"
                alt="Profile picture"
            />
            <h2 className="text-center text-2xl font-semibold mt-3">June</h2>
            <p className="text-center text-gray-600 mt-1">Software Engineer</p>
            <div className="flex justify-center mt-5">
                <a
                    href="https://github.com/fromhelianthus"
                    className="text-blue-500 hover:text-blue-700 mx-3"
                >
                    GitHub
                </a>
                <a href="#" className="text-blue-500 hover:text-blue-700 mx-3">
                    LinkedIn
                </a>
                <a
                    href="https://x.com/fromhelianthus"
                    className="text-blue-500 hover:text-blue-700 mx-3"
                >
                    Twitter
                </a>
            </div>
            <div className="mt-5">
                <h3 className="text-xl font-semibold">지금은 공사중!</h3>
                <p className="text-gray-600 mt-2">
                    지난 2년 동안 notion, velog, 지면에 기록한 내용들을 모아
                    정리하고 있습니다.
                </p>
            </div>
        </div>
    );
}

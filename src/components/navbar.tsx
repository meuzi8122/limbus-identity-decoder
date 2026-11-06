import { Link } from "@tanstack/react-router";

export function Navbar() {
	return (
		<div className="navbar bg-neutral text-neutral-content">
			<div className="flex-1">
				<Link to="/" className="px-2 text-xl font-bold text-neutral-content">
					リンバス人格当て
				</Link>
			</div>
			<div className="flex-none">
				<div className="dropdown dropdown-left">
					<button
						type="button"
						tabIndex={0}
						className="btn btn-ghost btn-circle"
					>
						{/* biome-ignore lint/a11y/noSvgWithoutTitle: 装飾用のハンバーガーアイコンのため title 不要 */}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth="1.5"
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							></path>
						</svg>
					</button>
					<ul
						tabIndex={-1}
						className="menu dropdown-content bg-neutral text-neutral-content rounded-box z-10 mt-3 w-52 p-2 shadow-lg border border-neutral-content/20"
					>
						<li>
							<Link to="/">クイズをプレイ</Link>
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

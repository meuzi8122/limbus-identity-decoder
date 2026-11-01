import { Link } from "@tanstack/react-router";

export function Navbar() {
	return (
		<div className="navbar bg-base-100 shadow-sm mb-2">
			<div className="flex-1">
				<Link to="/" className="btn btn-ghost text-xl">
					Limbus Identity Decoder
				</Link>
			</div>
			<div className="flex-none">
				<div className="dropdown dropdown-left">
					<button
						type="button"
						tabIndex={0}
						className="btn btn-ghost btn-circle"
					>
						{/** biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
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
						className="menu dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
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

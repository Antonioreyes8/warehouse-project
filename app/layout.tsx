"use client";

import Header from "./components/Header";
import Footer from "./components/Footer";
import "./globals.css";
import "./home/home.module.css";
import "./components/components.css";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { config } from '@fortawesome/fontawesome-svg-core'
import '../lib/ui/icons'

import { usePathname } from "next/navigation";

config.autoAddCss = false;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();

	const hideFooter = pathname === "/linktree";

	return (
		<html lang="en">
			<body>
				<Header />
				<main>{children}</main>
				{!hideFooter && <Footer />}
			</body>
		</html>
	);
}
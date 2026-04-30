import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type MockLinkProps = {
	href: string;
	className?: string;
	children: ReactNode;
};

type MockImageProps = {
	src: string;
	alt: string;
} & ComponentPropsWithoutRef<"img">;

const mocks = vi.hoisted(() => ({
	pushMock: vi.fn(),
	getSessionMock: vi.fn(),
	signOutMock: vi.fn(),
	getArtistByEmailMock: vi.fn(),
	isEmailAuthorizedMock: vi.fn(),
	updateArtistProfileMock: vi.fn(),
	getArtistWorksByProfileIdMock: vi.fn(),
	syncArtistWorksMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: mocks.pushMock }),
}));

vi.mock("next/link", () => ({
	default: ({ href, className, children }: MockLinkProps) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

vi.mock("next/image", () => ({
	default: ({ src, alt, ...props }: MockImageProps) => (
		<img src={src} alt={alt} {...props} />
	),
}));

vi.mock("@/lib/supabase/client", () => ({
	supabase: {
		auth: {
			getSession: mocks.getSessionMock,
			signOut: mocks.signOutMock,
		},
	},
}));

vi.mock("@/lib/artists/queries", () => ({
	getArtistByEmail: mocks.getArtistByEmailMock,
	isEmailAuthorized: mocks.isEmailAuthorizedMock,
	getArtistWorksByProfileId: mocks.getArtistWorksByProfileIdMock,
}));

vi.mock("@/lib/artists/mutations", () => ({
	updateArtistProfile: mocks.updateArtistProfileMock,
	syncArtistWorks: mocks.syncArtistWorksMock,
}));

import ArtistProfilePage from "@/app/artists/dashboard/profile/page";

beforeEach(() => {
	vi.clearAllMocks();
	mocks.getSessionMock.mockResolvedValue({
		data: { session: { user: { id: "uid-1", email: "f2arc.8@gmail.com" } } },
	});
	mocks.getArtistWorksByProfileIdMock.mockResolvedValue([]);
	mocks.syncArtistWorksMock.mockResolvedValue({ success: true });
});

describe("Dashboard Form Edge Cases", () => {
	it("shows Access Denied when user is not allowlisted", async () => {
		mocks.isEmailAuthorizedMock.mockResolvedValue(false);

		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("Access Denied")).toBeInTheDocument();
		});
	});

	it("shows Profile Not Found when allowlisted but no profile row exists", async () => {
		mocks.isEmailAuthorizedMock.mockResolvedValue(true);
		mocks.getArtistByEmailMock.mockResolvedValue(null);

		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("Profile Not Found")).toBeInTheDocument();
		});
	});

	it("routes to login when no session exists", async () => {
		mocks.getSessionMock.mockResolvedValueOnce({ data: { session: null } });
		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(mocks.pushMock).toHaveBeenCalledWith("/login");
		});
	});

	it("submits empty optional fields without crashing", async () => {
		const user = userEvent.setup();
		mocks.isEmailAuthorizedMock.mockResolvedValue(true);
		mocks.getArtistByEmailMock.mockResolvedValue({
			id: "42",
			email: "f2arc.8@gmail.com",
			name: "Antonio",
			username: "antonioreyes",
			bio: null,
			birthday: null,
		});
		mocks.updateArtistProfileMock.mockResolvedValue({ success: true });

		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(mocks.updateArtistProfileMock).toHaveBeenCalled();
		});
	});
});

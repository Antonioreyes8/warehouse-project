import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
	default: ({ href, className, children }: any) => (
		<a href={href} className={className}>
			{children}
		</a>
	),
}));

vi.mock("next/image", () => ({
	default: ({ src, alt, ...props }: any) => (
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

import ArtistProfilePage from "@/app/dashboard/profile/page";

const baseArtist = {
	id: "42",
	email: "f2arc.8@gmail.com",
	name: "Antonio Reyes",
	username: "antonioreyes",
	bio: "Original bio",
	birthday: "1998-07-21",
	based_in: "Denton, TX",
	mediums: "Performance",
	past_projects: "Project One",
	ethnic_background: "Hispanic/Latino",
	contact: "tony@surco.studio",
	status: "Open for Work",
	member_since: "2025-05",
	instagram: "https://instagram.com/antonioreyes",
	youtube: "https://youtube.com/@antonioreyes",
	patreon: "https://patreon.com/antonioreyes",
	facebook: "https://facebook.com/antonioreyes",
	tik_tok: "https://tiktok.com/@antonioreyes",
	etsy: "https://etsy.com/shop/antonioreyes",
	personal_website: "https://antonioreyes.com",
	soundcloud: "https://soundcloud.com/antonioreyes",
	bandcamp: "https://antonioreyes.bandcamp.com",
};

beforeEach(() => {
	vi.clearAllMocks();
	mocks.getSessionMock.mockResolvedValue({
		data: { session: { user: { id: "uid-1", email: "f2arc.8@gmail.com" } } },
	});
	mocks.isEmailAuthorizedMock.mockResolvedValue(true);
	mocks.getArtistByEmailMock.mockResolvedValue(baseArtist);
	mocks.getArtistWorksByProfileIdMock.mockResolvedValue([]);
	mocks.updateArtistProfileMock.mockResolvedValue({ success: true });
	mocks.syncArtistWorksMock.mockResolvedValue({ success: true });
});

describe("Dashboard Form Black-Box", () => {
	it("renders and submits all form entries successfully", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(screen.getByLabelText("Name *")).toBeInTheDocument();
		expect(screen.getByLabelText("Username *")).toBeInTheDocument();
		expect(screen.getByLabelText("Bio")).toBeInTheDocument();
		expect(screen.getByLabelText("Birth Date")).toBeInTheDocument();
		expect(screen.getByLabelText("Based In")).toBeInTheDocument();
		expect(screen.getByLabelText("Mediums")).toBeInTheDocument();
		expect(screen.getByLabelText("Past Projects")).toBeInTheDocument();
		expect(screen.getByLabelText("Ethnic Background")).toBeInTheDocument();
		expect(screen.getByLabelText("Contact")).toBeInTheDocument();
		expect(screen.getByLabelText("Status")).toBeInTheDocument();
		expect(screen.getByLabelText("Instagram")).toBeInTheDocument();
		expect(screen.getByLabelText("YouTube")).toBeInTheDocument();
		expect(screen.getByLabelText("Patreon")).toBeInTheDocument();
		expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
		expect(screen.getByLabelText("TikTok")).toBeInTheDocument();
		expect(screen.getByLabelText("Etsy")).toBeInTheDocument();
		expect(screen.getByLabelText("Personal Website")).toBeInTheDocument();
		expect(screen.getByLabelText("SoundCloud")).toBeInTheDocument();
		expect(screen.getByLabelText("Bandcamp")).toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(mocks.updateArtistProfileMock).toHaveBeenCalled();

			const [artistIdArg, emailArg, payloadArg] =
				mocks.updateArtistProfileMock.mock.calls.at(-1) || [];

			expect(String(artistIdArg)).toBe("42");
			expect(emailArg).toBe("f2arc.8@gmail.com");
			expect(payloadArg).toMatchObject({
				name: "Antonio Reyes",
				username: "antonioreyes",
				bio: "Original bio",
				birthday: "1998-07-21",
				based_in: "Denton, TX",
				mediums: "Performance",
				past_projects: "Project One",
				ethnic_background: "Hispanic/Latino",
				contact: "tony@surco.studio",
				status: "Open for Work",
				instagram: "https://instagram.com/antonioreyes",
				youtube: "https://youtube.com/@antonioreyes",
				patreon: "https://patreon.com/antonioreyes",
				facebook: "https://facebook.com/antonioreyes",
				tik_tok: "https://tiktok.com/@antonioreyes",
				etsy: "https://etsy.com/shop/antonioreyes",
				personal_website: "https://antonioreyes.com",
				soundcloud: "https://soundcloud.com/antonioreyes",
				bandcamp: "https://antonioreyes.bandcamp.com",
			});
		});

		expect(
			screen.getByText("Profile updated successfully!"),
		).toBeInTheDocument();
	});

	it("shows API error message when save fails", async () => {
		const user = userEvent.setup();
		mocks.updateArtistProfileMock.mockResolvedValueOnce({
			success: false,
			error: "Update failed",
		});

		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument();
		});

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(screen.getByText("Update failed")).toBeInTheDocument();
		});
	});
});

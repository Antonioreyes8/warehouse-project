/**
 * File: tests/forms/black-box/dashboard-works-form.blackbox.test.tsx
 * Tests for: app/dashboard/profile/page.tsx — works management (Featured Work section)
 *
 * Covers:
 *   - Existing works displayed in read-only view (title, medium, description)
 *   - "No featured work added yet" shown when works list is empty
 *   - Edit mode renders Medium input for each work
 *   - "Add Work" button appends a new empty work form
 *   - Delete Work with confirm=true removes the work and shows a confirmation message
 *   - Delete Work with confirm=false keeps the work unchanged
 *   - Save calls syncArtistWorks with correct payload (including medium field)
 *   - syncArtistWorks error is shown to the user
 */

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
		storage: {
			from: () => ({
				upload: vi.fn().mockResolvedValue({ error: null }),
				getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "" } }),
			}),
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
	bio: "A bio",
	birthday: "1998-07-21",
	based_in: "Denton, TX",
	mediums: "Performance",
	past_projects: "Project One",
	ethnic_background: "Hispanic/Latino",
	contact: "tony@surco.studio",
	status: "Open for Work",
	member_since: "2025-05",
	instagram: "",
	youtube: "",
	patreon: "",
	facebook: "",
	tik_tok: "",
	etsy: "",
	personal_website: "",
	soundcloud: "",
	bandcamp: "",
};

const existingWork = {
	id: 1,
	profile_id: "42",
	title: "Untitled No. 1",
	description: "A photograph of the city",
	medium: "Digital photography",
	image_url: null,
	link_url: null,
	sort_order: 0,
	created_at: "2025-01-01T00:00:00Z",
	updated_at: "2025-01-01T00:00:00Z",
};

beforeEach(() => {
	vi.clearAllMocks();
	mocks.getSessionMock.mockResolvedValue({
		data: { session: { user: { id: "uid-1", email: "f2arc.8@gmail.com" } } },
	});
	mocks.isEmailAuthorizedMock.mockResolvedValue(true);
	mocks.getArtistByEmailMock.mockResolvedValue(baseArtist);
	mocks.getArtistWorksByProfileIdMock.mockResolvedValue([existingWork]);
	mocks.updateArtistProfileMock.mockResolvedValue({ success: true });
	mocks.syncArtistWorksMock.mockResolvedValue({ success: true });
});

// ─── Read-only view ───────────────────────────────────────────────────────────

describe("Dashboard Works — read-only view", () => {
	it("displays existing work title, medium, and description", async () => {
		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument();
		});

		// Read-only view uses <strong>Title:</strong> followed by the value
		expect(screen.getByText(/Untitled No\. 1/)).toBeInTheDocument();
		expect(screen.getByText(/Digital photography/)).toBeInTheDocument();
		expect(screen.getByText(/A photograph of the city/)).toBeInTheDocument();
	});

	it("shows 'No featured work added yet.' when works list is empty", async () => {
		mocks.getArtistWorksByProfileIdMock.mockResolvedValueOnce([]);

		render(<ArtistProfilePage />);

		await waitFor(() => {
			expect(
				screen.getByText("No featured work added yet."),
			).toBeInTheDocument();
		});
	});
});

// ─── Edit mode form ───────────────────────────────────────────────────────────

describe("Dashboard Works — edit mode form", () => {
	it("renders the Work Title input for each loaded work", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(screen.getByLabelText("Work Title")).toBeInTheDocument();
	});

	it("renders the Medium input for each loaded work", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(screen.getByLabelText("Medium")).toBeInTheDocument();
	});

	it("renders the Description input for each loaded work", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(screen.getByLabelText("Work Description")).toBeInTheDocument();
	});

	it("populates work fields with existing work data", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(screen.getByLabelText("Work Title")).toHaveValue("Untitled No. 1");
		expect(screen.getByLabelText("Medium")).toHaveValue("Digital photography");
	});
});

// ─── Add Work ─────────────────────────────────────────────────────────────────

describe("Dashboard Works — Add Work button", () => {
	it("shows 'No works added yet' message when editing with zero works", async () => {
		mocks.getArtistWorksByProfileIdMock.mockResolvedValue([]);
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		expect(
			screen.getByText("No works added yet. Click Add Work to create one."),
		).toBeInTheDocument();
	});

	it("adds a new empty work form when 'Add Work' is clicked", async () => {
		mocks.getArtistWorksByProfileIdMock.mockResolvedValueOnce([]);
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Add Work" }));

		expect(screen.getByLabelText("Work Title")).toBeInTheDocument();
		expect(screen.getByLabelText("Medium")).toBeInTheDocument();
	});
});

// ─── Delete Work ──────────────────────────────────────────────────────────────

describe("Dashboard Works — Delete Work button", () => {
	it("removes work from form and shows confirmation message when user confirms", async () => {
		vi.spyOn(window, "confirm").mockReturnValueOnce(true);
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		// Work title should be in the form
		expect(screen.getByLabelText("Work Title")).toHaveValue("Untitled No. 1");

		await user.click(screen.getByRole("button", { name: "Delete Work" }));

		// Work form should be gone and confirmation message shown
		await waitFor(() => {
			expect(screen.queryByLabelText("Work Title")).not.toBeInTheDocument();
			expect(
				screen.getByText(
					"Work removed from the form. Click Save Changes to confirm.",
				),
			).toBeInTheDocument();
		});
	});

	it("keeps the work when user cancels the confirmation dialog", async () => {
		vi.spyOn(window, "confirm").mockReturnValueOnce(false);
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));

		await user.click(screen.getByRole("button", { name: "Delete Work" }));

		// Work form should still be present
		expect(screen.getByLabelText("Work Title")).toHaveValue("Untitled No. 1");
	});
});

// ─── Save with works ──────────────────────────────────────────────────────────

describe("Dashboard Works — save", () => {
	it("calls syncArtistWorks with the correct payload on save", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(mocks.syncArtistWorksMock).toHaveBeenCalledWith(
				"42",
				expect.arrayContaining([
					expect.objectContaining({
						id: 1,
						title: "Untitled No. 1",
						medium: "Digital photography",
						description: "A photograph of the city",
					}),
				]),
			);
		});
	});

	it("includes the medium field in the syncArtistWorks payload", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			const worksArg = mocks.syncArtistWorksMock.mock.calls.at(-1)?.[1];
			expect(worksArg?.[0]).toMatchObject({ medium: "Digital photography" });
		});
	});

	it("shows success message after a successful save", async () => {
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(
				screen.getByText("Profile updated successfully!"),
			).toBeInTheDocument();
		});
	});

	it("shows syncArtistWorks error when works sync fails", async () => {
		mocks.syncArtistWorksMock.mockResolvedValueOnce({
			success: false,
			error: "Works sync failed",
		});
		const user = userEvent.setup();
		render(<ArtistProfilePage />);

		await waitFor(() =>
			expect(screen.getByText("My Artist Profile")).toBeInTheDocument(),
		);

		await user.click(screen.getByRole("button", { name: "Edit Profile" }));
		await user.click(screen.getByRole("button", { name: "Save Changes" }));

		await waitFor(() => {
			expect(screen.getByText("Works sync failed")).toBeInTheDocument();
		});
	});
});

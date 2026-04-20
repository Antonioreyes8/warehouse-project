/**
 * File: app/guidelines/guidelinesSection.tsx
 * Purpose: Renders the complete governance and conduct framework for the community.
 * Responsibilities:
 *   - Present policy-like guidance in a readable article format
 *   - Define participation expectations, safety standards, and enforcement language
 * Key Concepts:
 *   - Structured static content rendering
 *   - Heading/subheading hierarchy for policy scanning
 * Dependencies:
 *   - Global utility classes (basic_section, basic_content, indented)
 * How It Fits:
 *   - Serves as the authoritative behavioral contract linked across public routes
 */

// GuidelinesSection component
// Content is organized as articles so users can reference rules quickly and unambiguously.
export default function GuidelinesSection() {
	return (
		<section className="basic_section">
			<div className="basic_content">
				{/* Guidelines document body
				    The article structure is intentional: it mirrors policy docs and makes
				    enforcement expectations easier to understand for members and organizers.
				*/}
				<div>
					<h2>Community Guidelines</h2>
					<h3>Article I. Our Mission & Shared Responsibility</h3>
					<br></br>
					<p>
						Membership in this community is a shared commitment to the
						preservation of a creative and collaborative environment. By
						participating, every member accepts the responsibility to act as a
						steward of the space, ensuring that their actions contribute to a
						culture of inclusivity, safety, and support.
					</p>
					<br></br>
					<h3>Article II. Media, Privacy & Public Visibility</h3>
					<br></br>
					<p>
						The nature of this community involves the documentation and
						celebration of our collective work.
					</p>
					<br></br>
					<h4>Public Environment Notice:</h4>
					<br></br>
					<p className="indented">
						This space is a public-facing environment. By entering and
						participating in community activities, members acknowledge and
						accept that the environment is actively photographed and filmed, and
						that their likeness may be captured.
					</p>
					<br></br>
					<h4>Purpose of Documentation:</h4>
					<br></br>
					<p className="indented">
						Media captured within the space is intended for shared use within
						the community. The primary goal of this documentation is to
						facilitate cross-disciplinary collaboration and to assist members in
						professional portfolio building.
					</p>
					<br></br>
					<h4>Shared Visibility & Privacy:</h4>
					<br></br>
					<p className="indented">
						Members are encouraged to document and share their personal
						experiences. However, we expect a high degree of professional
						courtesy; privacy must be respected when requested by individuals,
						particularly in sensitive or focused contexts.
					</p>
					<br></br>
					<h4>Consent and Liability:</h4>
					<br></br>
					<p className="indented">
						For content published via official organization accounts, the
						leadership will take reasonable precautions to obtain specific
						consent on a case-by-case basis.
					</p>
					<br></br>
					<h4>Third-Party Disclaimer:</h4>
					<br></br>
					<p className="indented">
						While the organization strives for a culture of consent, it does not
						assume liability for the actions of third parties or individual
						members. The organization is not responsible for ensuring that
						independent members or visitors adhere to these internal consent
						precautions when capturing or sharing their own media.
					</p>
					<br></br>
					<h3>Article III. Stewardship of Space & Resources</h3>
					<br></br>
					<p>
						To ensure the longevity of our facilities, members must adhere to
						the following:
					</p>
					<br></br>
					<h4>Equipment Integrity:</h4>
					<br></br>
					<p className="indented">
						All tools, technology, and hardware must be used solely for their
						intended purposes. Destruction, negligent misuse, or unauthorized
						modification of equipment will not be tolerated.
					</p>
					<br></br>
					<h4>Zonal Respect:</h4>
					<br></br>
					<p className="indented">
						Dedicated areas are optimized for specific activities. Members must
						respect the boundaries of these zones to ensure the safety and focus
						of others.
					</p>
					<br></br>
					<h4>Operational Flow:</h4>
					<br></br>
					<p className="indented">
						Members are required to follow the established organization and flow
						of activities to maintain an efficient and harmonious environment.
					</p>
					<br></br>
					<h3>Article IV. Commitment to Safety & Inclusion</h3>
					<br></br>
					<p>
						We do not merely offer a &quot;safe space&quot;; we maintain an
						Intentional Sanctuary. We are a community that actively prioritizes
						the safety, dignity, and equity of women, LGBTQ+ individuals,
						immigrants, and working class artists. We are committed to fostering
						an environment where all members feel empowered to express
						themselves without fear of discrimination, harassment, or
						marginalization. We expect all members to uphold these values and to
						contribute to a culture of radical respect and mutual support.
					</p>
					<br></br>
					<h3>Article V. Leadership & Governance</h3>
					<br></br>
					<p>
						Our community is guided by a collective leadership model that values
					</p>
					<br></br>
					<h4>Zero-Tolerance Policy:</h4>
					<br></br>
					<p className="indented">
						Harassment, discrimination, intimidation, or the intentional
						exclusion of any member based on identity or background is a
						fundamental breach of this contract. We expect all interactions to
						be rooted in professional courtesy and radical respect.
					</p>
					<br></br>
					<h3>Article V. Governance and Structural Authority</h3>
					<br></br>
					<p>
						The sustainability of our community relies on respect for its
						leadership and operational structure.
					</p>
					<br></br>
					<h4>Facilitator Authority:</h4>
					<br></br>
					<p className="indented">
						Organizers and facilitators are the designated leads for safety and
						scheduling. Their instructions regarding the use of the space must
						be followed immediately and without exception.
					</p>
					<br></br>
					<h4>Finality of Decisions:</h4>
					<br></br>
					<p className="indented">
						Decisions made by leadership regarding the protection of the
						community, the space, or its members are final.
					</p>
					<br></br>
					<h3>Article VI. Prohibited Use and Legal Compliance</h3>
					<br></br>
					<p>
						The space exists for the advancement of our community’s core
						mission.
					</p>
					<br></br>
					<h4>Authorized Use Only:</h4>
					<br></br>
					<p className="indented">
						The exploitation, manipulation, or misrepresentation of the space
						for personal gain outside of its intended purpose is prohibited.
					</p>
					<br></br>
					<h4>Illegal Activity:</h4>
					<br></br>
					<p className="indented">
						The possession, sale, or distribution of illegal substances and any
						engagement in illegal activities are strictly prohibited.
					</p>
					<br></br>
					<h3>Article VII. Accountability and Enforcement</h3>
					<br></br>
					<p>We hold our members to a high standard of conduct.</p>
					<br></br>
					<h4>Corrective Action:</h4>
					<br></br>
					<p className="indented">
						Any individual found in violation of these guidelines may be asked
						to vacate the space immediately.
					</p>
					<br></br>
					<h4>Permanent Removal:</h4>
					<br></br>
					<p className="indented">
						Repeated or severe violations will result in the permanent
						revocation of membership and a ban from all future events and
						community platforms.
					</p>
				</div>
			</div>
		</section>
	);
}

/**
 * File: app/financials/financialSection.tsx
 */

"use client";

// Import your brand new CSS file!
import "./financials.css";

import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

// 1. The exact same data, formatted for Recharts
const data = [
	{ name: "The Cause", value: 20 },
	{ name: "People Involved", value: 20 },
	{ name: "Future Investment", value: 60 },
];

// 2. The hex codes for Rose, Emerald, and Blue to match your dark theme
const COLORS = ["#9D4343", "#4B7091", "#538C55"];

export default function FinancialSection() {
	return (
		<section className="basic_section">
			<div className="basic_content financials_content">
				{/* Clean CSS classes instead of inline styles */}
				<div className="financials_container">
					{/* Left Column: Text */}
					<div className="financials_text">
						<h2>The Breakdown</h2>
						<br />
						<p>
							Transparency is an active choice. Here is exactly how our funding
							is distributed back into the community, to our artists, and into
							building the future of this space.
						</p>
						<br />

						<p>
							<strong>The Cause (20%):</strong> This slice represents the funds
							going directly back into the community and to the artists. It is
							the active financial support for the core mission and the specific
							causes that align with our values.
						</p>

						<br />

						<p>
							<strong>People Involved (20%):</strong> This portion ensures that
							the creators, organizers, and team members who make this space
							possible are recognized and supported for their time and labor.
						</p>

						<br />

						<p>
							<strong>Future Investment (60%):</strong> As the largest slice,
							this shows our commitment to longevity. It represents the
							resources being saved and reinvested into building the future of
							this space, ensuring the incubator can grow and sustain itself
							long-term.
						</p>
					</div>

					{/* Right Column: Chart */}
					<div className="financials_chart">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={data}
									cx="50%"
									cy="50%"
									innerRadius={0}
									outerRadius="80%" /* Changed this to a percentage so it scales better on mobile! */
									fill="#8884d8"
									paddingAngle={0}
									dataKey="value"
								>
									{data.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index % COLORS.length]}
										/>
									))}
								</Pie>

								{/* Note: Recharts strictly requires these styles to be inline objects to work properly */}
								<Tooltip
									formatter={(value) => `${value}%`}
									contentStyle={{
										backgroundColor: "#2a2a2a",
										border: "none",
										borderRadius: "8px",
										color: "#fff",
									}}
									itemStyle={{ color: "#d3d3d3" }}
								/>

								<Legend
									verticalAlign="bottom"
									align="center"
									iconType="circle"
									iconSize={10}
									/* Use formatter to add custom spacing between legend items */
									formatter={(value) => (
										<span style={{ color: "#d3d3d3", marginRight: "20px" }}>
											{value}
										</span>
									)}
									wrapperStyle={{
										paddingTop: "30px" /* Space between Pie and Legend */,
										bottom: 0,
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</div>
			</div>
		</section>
	);
}

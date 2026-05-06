/**
 * File: app/financials/financialSection.tsx
 */

"use client";

import "./financials.css";
import {
	PieChart,
	Pie,
	Cell,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "The Cause", value: 20 },
	{ name: "The Community", value: 20 },
	{ name: "The Projects", value: 60 },
];

const COLORS = ["#9D4343", "#4B7091", "#538C55"];

export default function FinancialSection() {
	return (
		<section className="financials_section">
			<div className="financials_container">
				<h1 className="financials_mainTitle">Financial Breakdown</h1>

				{/* NEW INTRO SECTION: Centered above the grid */}
				<div className="financials_introText">
					<p className="financials_text">
						We are committed to maintaining a non-profit approach to the way we
						operate. The Diaspora Project was created to support local artists,
						build community, and make a positive impact.
					</p>
					<p className="financials_text">
						Ticket sales are the main way we can continue to do what we do.
						Every time you buy a ticket, you directly support the local
						community while also contributing to a cause the community has
						chosen.
					</p>
				</div>

				<div className="financials_bentoGrid">
					{/* Left Box: The Breakdown details */}
					<div className="financials_articleBox">
						<h3 className="financials_articleHeader">The Breakdown</h3>

						<h4 className="financials_subHeader">The Projects (60%)</h4>
						<p className="financials_text financials_indented">
							We want to continue to have more projects and grow our community.
							We use this portion to pay off what was invested into the event
							and to fund future projects including venue rentals, production
							costs, and other expenses.
						</p>

						<h4 className="financials_subHeader">The Cause (20%)</h4>
						<p className="financials_text financials_indented">
							Before each event we vote on a cause to support because we believe
							we have a responsibility to use our platform to bring attention
							and resources to important issues. This portion of the funds is
							donated to a cause collectively chosen by the community.
						</p>

						<h4 className="financials_subHeader">The Community (20%)</h4>
						<p className="financials_text financials_indented">
							From the artists to those who help clean up after, we encourage
							everyone to get involved in the work that goes into making our
							events happen. This portion is distributed among the artists,
							organizers, and volunteers.
						</p>
					</div>

					{/* Right Box: The Chart */}
					<div className="financials_articleBox">
						<h3 className="financials_articleHeader">Distribution</h3>

						<div className="financials_chartContainer">
							<ResponsiveContainer width="100%" height="100%">
								<PieChart>
									<Pie
										data={data}
										cx="50%"
										cy="50%"
										innerRadius={0}
										outerRadius="80%"
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

									<Tooltip
										formatter={(value) => `${value}%`}
										contentStyle={{
											backgroundColor: "#1a1a1a",
											border: "1px solid #444",
											borderRadius: "8px",
											color: "#fff",
										}}
										itemStyle={{ color: "#d3d3d3" }}
									/>

									<Legend
										verticalAlign="bottom"
										align="center"
										iconType="circle"
										iconSize={12}
										formatter={(value) => (
											<span style={{ color: "#d3d3d3", marginRight: "20px" }}>
												{value}
											</span>
										)}
										wrapperStyle={{ paddingTop: "20px" }}
									/>
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

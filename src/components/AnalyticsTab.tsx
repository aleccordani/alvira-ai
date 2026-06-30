import React, { useState } from "react";
import { BarChart3, TrendingUp, Clock, Zap, ArrowUpRight, ArrowDownRight, Globe, Cpu, RefreshCw } from "lucide-react";
import { AnalyticsMetric } from "../types";

export default function AnalyticsTab() {
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  const mockData: AnalyticsMetric[] = [
    { date: "Mon", tokens: 12000, timeSaved: 1.2, requests: 12 },
    { date: "Tue", tokens: 19000, timeSaved: 2.1, requests: 18 },
    { date: "Wed", tokens: 32000, timeSaved: 3.4, requests: 29 },
    { date: "Thu", tokens: 25000, timeSaved: 2.8, requests: 22 },
    { date: "Fri", tokens: 18000, timeSaved: 1.9, requests: 15 },
    { date: "Sat", tokens: 8000, timeSaved: 0.8, requests: 6 },
    { date: "Sun", tokens: 10000, timeSaved: 2.0, requests: 10 },
  ];

  const totalTokens = mockData.reduce((acc, curr) => acc + curr.tokens, 0);
  const totalTimeSaved = mockData.reduce((acc, curr) => acc + curr.timeSaved, 0);
  const totalRequests = mockData.reduce((acc, curr) => acc + curr.requests, 0);

  // SVG Dimension setups for custom charts
  const width = 500;
  const height = 180;
  const padding = 30;

  // Find max values for scale calculations
  const maxTokens = Math.max(...mockData.map((d) => d.tokens));
  const maxTime = Math.max(...mockData.map((d) => d.timeSaved));

  return (
    <div className="flex-1 overflow-y-auto bg-[#0b0c10] text-[#c5c6c7] p-8 font-sans selection:bg-purple-600 selection:text-white" id="analytics-tab">
      {/* Analytics Summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Metric 1 */}
        <div className="bg-[#16171f] border border-purple-950/15 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#8b8e99] font-bold uppercase tracking-wider block">Aggregate Tokens</span>
            <span className="text-2xl font-extrabold text-white block mt-2">{(totalTokens / 1000).toFixed(1)}k</span>
          </div>
          <div className="mt-4 text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14.2% versus last week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#16171f] border border-purple-950/15 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#8b8e99] font-bold uppercase tracking-wider block">Operational Savings</span>
            <span className="text-2xl font-extrabold text-[#a78bfa] block mt-2">{totalTimeSaved.toFixed(1)} hrs</span>
          </div>
          <div className="mt-4 text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+8% versus last week</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#16171f] border border-purple-950/15 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#8b8e99] font-bold uppercase tracking-wider block">Requests Dispatched</span>
            <span className="text-2xl font-extrabold text-white block mt-2">{totalRequests} calls</span>
          </div>
          <div className="mt-4 text-[10px] text-[#8b8e99] font-mono flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Avg 15.4s response latency</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#16171f] border border-purple-950/15 p-5 rounded-2xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-[#8b8e99] font-bold uppercase tracking-wider block">Cache Ingress Ratio</span>
            <span className="text-2xl font-extrabold text-emerald-400 block mt-2">41.2%</span>
          </div>
          <div className="mt-4 text-[10px] text-emerald-400 font-mono flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Reduces overall token cost</span>
          </div>
        </div>
      </div>

      {/* SVG Charts Bento Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Chart 1: Token Usage Bar Chart */}
        <div className="bg-[#16171f] border border-purple-950/15 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Daily Tokens Processed (Past 7 Days)
          </h3>

          <div className="relative flex justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yPos = padding + (height - 2 * padding) * ratio;
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={yPos}
                    x2={width - padding}
                    y2={yPos}
                    stroke="#1d1e2b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Render Bars */}
              {mockData.map((d, idx) => {
                const barCount = mockData.length;
                const innerWidth = width - 2 * padding;
                const colWidth = innerWidth / barCount;
                const barWidth = colWidth * 0.5;

                const x = padding + colWidth * idx + colWidth * 0.25;
                const barHeight = ((height - 2 * padding) * d.tokens) / maxTokens;
                const y = height - padding - barHeight;

                const isHovered = hoveredBar === idx;

                return (
                  <g key={idx}>
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={Math.max(barHeight, 2)}
                      rx="4"
                      fill={isHovered ? "#a78bfa" : "#7c3aed"}
                      className="transition-all duration-300 cursor-pointer"
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                    />
                    {/* Date label */}
                    <text
                      x={x + barWidth / 2}
                      y={height - 10}
                      fill="#8b8e99"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {d.date}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip display */}
            {hoveredBar !== null && (
              <div className="absolute top-4 right-4 bg-[#0a0a0f] border border-purple-950/40 p-2.5 rounded-lg text-[10px] font-mono shadow-xl">
                <span className="text-[#8b8e99] block font-sans">Tokens processed:</span>
                <span className="text-white font-bold block mt-0.5">
                  {mockData[hoveredBar].tokens.toLocaleString()} tokens
                </span>
                <span className="text-purple-400 block mt-1">
                  ({mockData[hoveredBar].requests} requests)
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 2: Time Saved Smooth Line Chart */}
        <div className="bg-[#16171f] border border-purple-950/15 p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-white tracking-tight mb-6 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Operational Hours Saved (Past 7 Days)
          </h3>

          <div className="relative flex justify-center">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const yPos = padding + (height - 2 * padding) * ratio;
                return (
                  <line
                    key={idx}
                    x1={padding}
                    y1={yPos}
                    x2={width - padding}
                    y2={yPos}
                    stroke="#1d1e2b"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}

              {/* Compute Line Points */}
              {(() => {
                const innerWidth = width - 2 * padding;
                const colWidth = innerWidth / (mockData.length - 1);
                const points = mockData.map((d, idx) => {
                  const x = padding + colWidth * idx;
                  const ratio = d.timeSaved / maxTime;
                  const y = height - padding - (height - 2 * padding) * ratio;
                  return { x, y, val: d.timeSaved, date: d.date };
                });

                // Format Bezier Curve path string
                let dPath = `M ${points[0].x} ${points[0].y}`;
                for (let i = 0; i < points.length - 1; i++) {
                  const p0 = points[i];
                  const p1 = points[i + 1];
                  const cpX1 = p0.x + colWidth / 2;
                  const cpY1 = p0.y;
                  const cpX2 = p0.x + colWidth / 2;
                  const cpY2 = p1.y;
                  dPath += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
                }

                return (
                  <g>
                    {/* Glowing background stroke */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke="#059669"
                      strokeWidth="6"
                      opacity="0.15"
                      strokeLinecap="round"
                    />
                    {/* Solid front stroke */}
                    <path
                      d={dPath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Point Circle Handles */}
                    {points.map((p, idx) => {
                      const isHovered = hoveredLine === idx;
                      return (
                        <g key={idx}>
                          <circle
                            cx={p.x}
                            cy={p.y}
                            r={isHovered ? "6" : "4"}
                            fill={isHovered ? "#34d399" : "#10b981"}
                            stroke="#0a0a0f"
                            strokeWidth="1.5"
                            className="cursor-pointer transition-all duration-300"
                            onMouseEnter={() => setHoveredLine(idx)}
                            onMouseLeave={() => setHoveredLine(null)}
                          />
                          <text
                            x={p.x}
                            y={height - 10}
                            fill="#8b8e99"
                            fontSize="9"
                            textAnchor="middle"
                            fontFamily="monospace"
                          >
                            {p.date}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })()}
            </svg>

            {/* Line Chart Hover Tooltip */}
            {hoveredLine !== null && (
              <div className="absolute top-4 right-4 bg-[#0a0a0f] border border-purple-950/40 p-2.5 rounded-lg text-[10px] font-mono shadow-xl">
                <span className="text-[#8b8e99] block font-sans">Savings generated:</span>
                <span className="text-emerald-400 font-bold block mt-0.5">
                  {mockData[hoveredLine].timeSaved.toFixed(1)} hours saved
                </span>
                <span className="text-[#8b8e99] block mt-1">
                  ({mockData[hoveredLine].requests} sessions)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* API Endpoint call Distribution table */}
      <div className="bg-[#16171f] border border-purple-950/15 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-5">Security-Node API Endpoint Call Metrics</h3>
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-purple-950/20 text-[#8b8e99]">
                <th className="pb-3.5 font-semibold">ENDPOINT ROUTE</th>
                <th className="pb-3.5 font-semibold">HIT COUNT</th>
                <th className="pb-3.5 font-semibold">AVG TOKENS</th>
                <th className="pb-3.5 font-semibold">LATENCY PROFILE</th>
                <th className="pb-3.5 font-semibold">CACHE HIT RATIO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-purple-950/10 font-mono text-[11px] text-[#c5c6c7]">
              <tr className="hover:bg-purple-950/5 transition">
                <td className="py-3.5 font-semibold text-white">/api/chat</td>
                <td className="py-3.5">428 calls</td>
                <td className="py-3.5">1,250 tokens</td>
                <td className="py-3.5 text-emerald-400">1.2 seconds</td>
                <td className="py-3.5">38.4%</td>
              </tr>
              <tr className="hover:bg-purple-950/5 transition">
                <td className="py-3.5 font-semibold text-white">/api/generate-code</td>
                <td className="py-3.5">182 calls</td>
                <td className="py-3.5">1,850 tokens</td>
                <td className="py-3.5 text-emerald-400">1.8 seconds</td>
                <td className="py-3.5">44.1%</td>
              </tr>
              <tr className="hover:bg-purple-950/5 transition">
                <td className="py-3.5 font-semibold text-white">/api/summarize</td>
                <td className="py-3.5">92 calls</td>
                <td className="py-3.5">2,100 tokens</td>
                <td className="py-3.5 text-yellow-400">3.1 seconds</td>
                <td className="py-3.5">52.0%</td>
              </tr>
              <tr className="hover:bg-purple-950/5 transition">
                <td className="py-3.5 font-semibold text-white">/api/translate</td>
                <td className="py-3.5">45 calls</td>
                <td className="py-3.5">850 tokens</td>
                <td className="py-3.5 text-emerald-400">0.8 seconds</td>
                <td className="py-3.5">28.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

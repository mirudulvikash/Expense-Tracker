import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { Card } from '../ui/Card';

const COLORS = ['#FACC15', '#22C55E', '#EF4444', '#FFFFFF', '#A3A3A3', '#EAB308'];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  
  return (
    <g>
      <text x={cx} y={cy} dy={-8} textAnchor="middle" fill="#fff" fontSize={16} fontWeight="bold">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={16} textAnchor="middle" fill="#A3A3A3" fontSize={14}>
        {(percent * 100).toFixed(1)}%
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}60)` }}
      />
    </g>
  );
};

export const CategoryDonutChart = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  return (
    <Card className="bg-[#1a1a1a] border-[#262626] h-full flex flex-col p-6">
      <div className="mb-2">
        <h3 className="text-xl font-bold text-white tracking-tight">Category Breakdown</h3>
        <p className="text-sm text-[#A3A3A3]">Where your money goes</p>
      </div>
      <div className="flex-1 w-full min-h-[300px] relative">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={onPieEnter}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', borderColor: '#262626', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ color: '#FACC15', fontWeight: 'bold' }}
                labelStyle={{ display: 'none' }}
                formatter={(value) => [`₹${value}`, 'Amount']}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#A3A3A3]">No data for selected period</p>
          </div>
        )}
      </div>
    </Card>
  );
};

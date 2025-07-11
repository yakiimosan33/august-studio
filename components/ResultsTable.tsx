interface ResultsTableProps {
  options: Array<{
    id: string;
    option: string;
    votes: number;
    percentage: number;
  }>;
  totalVotes: number;
}

export default function ResultsTable({ options, totalVotes }: ResultsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-gray-200">
            <th className="text-left p-3">選択肢</th>
            <th className="text-right p-3">投票数</th>
            <th className="text-right p-3">割合</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.id} className="border-b border-gray-100">
              <td className="p-3">{option.option}</td>
              <td className="text-right p-3 font-medium">{option.votes}票</td>
              <td className="text-right p-3">{option.percentage}%</td>
            </tr>
          ))}
          <tr className="font-bold border-t-2 border-gray-200">
            <td className="p-3">合計</td>
            <td className="text-right p-3">{totalVotes}票</td>
            <td className="text-right p-3">100%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
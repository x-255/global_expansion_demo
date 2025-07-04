interface ProgressBarProps {
  progress: number
  currentGroup: number
  totalGroups: number
}

export function ProgressBar({
  progress,
  currentGroup,
  totalGroups,
}: ProgressBarProps) {
  return (
    <div className="w-full mb-2">
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-500">
          维度 {currentGroup + 1}/{totalGroups}
        </span>
        <span className="text-gray-500">总进度 {progress}%</span>
      </div>
    </div>
  )
}

import { useActionState } from 'react'
import { CompanyWithCount } from './CompaniesTable'
import { updateCompany } from '../actions'

interface Props {
  company: CompanyWithCount | null
  onClose: () => void
  onUpdated: () => void
}

export default function CompaniesForm({ company, onClose, onUpdated }: Props) {
  const [_, updateAction, isPending] = useActionState(
    async (prevState: void, formData: FormData) => {
      await updateCompany(prevState, formData, company?.id)
      onUpdated()
    },
    undefined
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form action={updateAction}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              公司名称
            </label>
            <input
              type="text"
              name="name"
              defaultValue={company?.name}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              行业
            </label>
            <input
              type="text"
              name="industry"
              defaultValue={company?.industry ?? ''}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              规模
            </label>
            <input
              type="text"
              name="size"
              defaultValue={company?.size ?? ''}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              地点
            </label>
            <input
              type="text"
              name="location"
              defaultValue={company?.location ?? ''}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

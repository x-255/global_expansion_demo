import { useActionState } from 'react'
import { CompanyWithCount } from './CompaniesTable'
import { updateCompany } from '../actions'
import { Modal, Button, Input } from '@/components/admin'

interface Props {
  company: CompanyWithCount | null
  onClose: () => void
  onUpdated: () => void
}

export default function CompaniesForm({ company, onClose, onUpdated }: Props) {
  const [, updateAction, isPending] = useActionState(
    async (prevState: void, formData: FormData) => {
      await updateCompany(prevState, formData, company?.id)
      onUpdated()
    },
    undefined
  )

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={company ? '编辑公司信息' : '添加公司'}
      size="md"
    >
      <form action={updateAction} className="flex flex-col flex-1">
        <Modal.Body className="space-y-6">
          <Input
            label="公司名称"
            name="name"
            defaultValue={company?.name}
            required
            placeholder="请输入公司名称"
          />

          <Input
            label="行业"
            name="industry"
            defaultValue={company?.industry ?? ''}
            placeholder="请输入所属行业"
          />

          <Input
            label="规模"
            name="size"
            defaultValue={company?.size ?? ''}
            placeholder="请输入公司规模"
          />

          <Input
            label="地点"
            name="location"
            defaultValue={company?.location ?? ''}
            placeholder="请输入公司地点"
          />
        </Modal.Body>

        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={onClose}>
            取消
          </Button>
          <Button type="submit" variant="primary" loading={isPending}>
            保存
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

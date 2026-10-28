import { avatarColor, initials } from '../utils'

const sizes = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
}

export default function Avatar({ name, size = 'sm' }: { name: string; size?: keyof typeof sizes }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${avatarColor(name)}`}
    >
      {initials(name)}
    </span>
  )
}

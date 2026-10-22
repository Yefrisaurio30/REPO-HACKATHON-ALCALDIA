import Icon from "./Icon"

export default function SearchBar({
  id,
  onChange,
  placeholder,
  value,
}: {
  id: string
  onChange: (value: string) => void
  placeholder: string
  value: string
}) {
  return (
    <label className="search-field" htmlFor={id}>
      <Icon name="search" />
      <span className="sr-only">Buscar</span>
      <input
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        type="search"
        value={value}
      />
    </label>
  )
}

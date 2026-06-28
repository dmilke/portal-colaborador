export default async function ColaboradorPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  return <div>Colaborador {id}</div>
}

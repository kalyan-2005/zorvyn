import FinancialRecords from "../records";

async function Page(context:{params:{id:string}}) {
  const { id } = await context.params;
  return (
    <FinancialRecords userId={id} />
  )
}

export default Page
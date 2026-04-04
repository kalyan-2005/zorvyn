import FinancialRecords from "../records";

async function Page(context:{params:{id:string}}) {
  const { id } = await context.params;
  return (
    <div className="min-w-0">
      <FinancialRecords userId={id} role="ADMIN" />
    </div>
  );
}

export default Page
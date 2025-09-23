// // import { NextResponse } from "next/server";
// // import { singers } from "../_data/singers";

// // export async function GET() {
// //   return NextResponse.json(singers.map(({ songs, ...rest }) => rest));
// // }
// // app/api/singers/[id]/route.ts
// import { NextResponse } from "next/server";
// // import { singers } from "../_data/singers"; // relative import

// export async function GET(req: Request, { params }: { params: { id: string } }) {
//   const singerId = parseInt(params.id);
//   const singer = singers.find((s) => s.id === singerId);

//   if (!singer) {
//     return NextResponse.json({ error: "Singer not found" }, { status: 404 });
//   }

//   return NextResponse.json(singer);
// }

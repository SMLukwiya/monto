import { type NextPage } from "next";
import DetailPage from "@/features/pull-requests/pages/pull-request.page";

type Props = {
  id: string;
};

const ShowPost: NextPage<Props> = ({ id }: Props) => {
  return <DetailPage id={id} />;
};

export function getServerSideProps(context: { params: Props }) {
  return {
    props: { id: context.params.id },
  };
}

export default ShowPost;

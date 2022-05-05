import { trpc } from '../App';

const Detail = (props: { id: number }) => {
  const cat = trpc.useQuery(['get', props.id]);

  return cat.data ? (
    <div className="Detail">
      <h2>Detail</h2>
      <div>{cat.data.cat.id}</div>
      <div>{cat.data.cat.name}</div>
    </div>
  ) : (
    <div className="Detail"></div>
  );
};

export default Detail;

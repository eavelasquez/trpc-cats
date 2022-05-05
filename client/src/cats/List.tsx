import { useState } from 'react';
import type { Cat } from '../../../server/src/router';
import { trpc } from '../App';

const List = (props: { setDetail: (id: number) => void }) => {
  const [error, setError] = useState('');

  const cats = trpc.useQuery(['list']);
  const deleteMutation = trpc.useMutation(['delete'], {
    onSuccess: () => {
      cats.refetch();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (id: number) => {
    deleteMutation.mutate({ id });
  };

  const catRow = (cat: Cat) => {
    return (
      <div key={cat.id}>
        <span>{cat.id}</span>
        <span>{cat.name}</span>
        <button onClick={() => props.setDetail.bind(null, cat.id)}>
          Detail
        </button>
        <button onClick={() => handleSubmit.bind(null, cat.id)}>Delete</button>
      </div>
    );
  };

  return (
    <div className="List">
      <h2>Cats</h2>
      <span>{error}</span>
      {cats.data
        ? cats.data.cats.map(catRow)
        : <span>Loading...</span>
      }
    </div>
  );
};

export default List;

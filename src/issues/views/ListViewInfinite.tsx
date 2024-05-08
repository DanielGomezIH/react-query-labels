import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import LoadingIcon from '../../shared/components/LoadingIcon';
import { State } from '../interfaces/issue';
import { useIssuesInfinite } from '../hooks';

export const ListViewInfinite = () => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [state, setState] = useState<State>();

  const { issuesQuery } = useIssuesInfinite({ state, labels: selectedLabels });

  const onLabelChanged = (labelName: string) => {
    selectedLabels.includes(labelName)
      ? setSelectedLabels(selectedLabels.filter((label) => label !== labelName))
      : setSelectedLabels([...selectedLabels, labelName]);
  };

  return (
    <div className='row mt-5'>
      <div className='col-8'>
        {issuesQuery.isLoading ? (
          <LoadingIcon />
        ) : (
          <IssueList
            issues={issuesQuery.data?.pages.flat() || []}
            state={state}
            onStateChanged={(newState) => setState(newState)}
          />
        )}

        <button
          disabled={!issuesQuery.hasNextPage}
          onClick={() => issuesQuery.fetchNextPage()}
          className='btn btn-outline-primary mt-2'
        >
          Load More
        </button>
      </div>

      <div className='col-4'>
        <LabelPicker
          selectedLabels={selectedLabels}
          onChange={(labelName) => onLabelChanged(labelName)}
        />
      </div>
    </div>
  );
};

// * El metodo .flat() de los arreglos se utiliza para dejar en un nivel determindo de profundida un arreglo que contien otros arreglos, ejemplo:

//* const arr1 = [1, 2, [3, 4]];
//* arr1.flat();
//* [1, 2, 3, 4]

//* const arr2 = [1, 2, [3, 4, [5, 6]]];
//* arr2.flat();
//* [1, 2, 3, 4, [5, 6]]

//* const arr3 = [1, 2, [3, 4, [5, 6]]];
//* arr3.flat(2);
//* [1, 2, 3, 4, 5, 6]

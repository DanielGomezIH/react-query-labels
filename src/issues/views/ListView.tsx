import { useState } from 'react';
import { IssueList } from '../components/IssueList';
import { LabelPicker } from '../components/LabelPicker';
import LoadingIcon from '../../shared/components/LoadingIcon';
import useIssuesList from '../hooks/useIssuesList';
import { State } from '../interfaces/issue';

export const ListView = () => {
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const [state, setState] = useState<State>();

  const { issuesQuery, page, nextPage, previousPage } = useIssuesList({
    state,
    labels: selectedLabels,
  });

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
            issues={issuesQuery.data || []}
            state={state}
            onStateChanged={(newState) => setState(newState)}
          />
        )}

        <div className='d-flex mt-2 justify-content-between align-items-center'>
          <button
            className='btn btn-outline-primary'
            disabled={issuesQuery.isFetching ? true : false}
            onClick={previousPage}
          >
            Previuos
          </button>
          <span>{page}</span>
          <button
            className='btn btn-outline-primary'
            disabled={issuesQuery.isFetching ? true : false}
            onClick={nextPage}
          >
            Next
          </button>
        </div>
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

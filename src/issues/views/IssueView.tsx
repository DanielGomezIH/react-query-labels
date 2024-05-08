import { Link, Navigate, useParams } from 'react-router-dom';
import { IssueComment } from '../components/IssueComment';
import useIssue from '../hooks/useIssue';
import LoadingIcon from '../../shared/components/LoadingIcon';

export const IssueView = () => {
  const params = useParams();

  const { id = '0' } = params;

  const { issueQuery, commentsQuery } = useIssue(+id);

  const { data: issue } = issueQuery;

  if (issueQuery.isLoading) {
    return <LoadingIcon />;
  }

  if (!issueQuery.data) {
    <Navigate to='./issues/list' />;
    return;
  }

  return (
    <div className='row mb-5'>
      <div className='col-12 mb-3'>
        <Link to='./issues/list'>Go Back</Link>
      </div>

      {/* Primer comentario */}
      <IssueComment issue={issue!} />

      {/* Comentario de otros */}

      {commentsQuery.isLoading && <LoadingIcon />}

      {commentsQuery.data?.map((issue) => (
        <IssueComment key={issue.id} issue={issue} />
      ))}
    </div>
  );
};

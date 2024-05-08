import { FiInfo, FiMessageSquare, FiCheckCircle } from 'react-icons/fi';
import { Issue } from '../interfaces';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { getIssueComments, getIssueInfo } from '../hooks';
import { timeSince } from '../../helpers';

interface IssueItemProps {
  issue: Issue;
}

export const IssueItem: FC<IssueItemProps> = ({ issue }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //* preFecthData es útil para hacer fetch de la data antes de que la necesitemos, en este caso realizamos el fetch de la data del issue especifico antes de haber entrado a donde este se renderiza, con esto logramos que al entrar en donde se renderiza, la información ya esté cargada.

  //* Inconveniente: En este caso se realiza una petición a la base de datos cada vez que se pase el mouse sobre el issue en la lista o el item en la lista.

  //* Ventajas: Siempre vamos a tener la data actual antes de necesitarla, por lo que al utilizarla va a ser instantaneo.

  const preFetchData = () => {
    queryClient.prefetchQuery({
      queryKey: ['issue', issue.number],
      queryFn: () => getIssueInfo(issue.number),
      staleTime: 1000 * 60,
    });

    queryClient.prefetchQuery({
      queryKey: ['issue', issue.number, 'comments'],
      queryFn: () => getIssueComments(issue.number),
      staleTime: 1000 * 60,
    });
  };

  // * setQueryData es útil cuando ya se tienen los datos disponibles sincrónicamente y se quiere o necesita agregarlos o actualizarlos en la caché.

  //* En este caso establecemos en el cache del issue específico ['issue', issue.number], la data del issue en específico que cargamos en un primer momento al cargar todos los issues.

  //* Ventajas: pre establecemos la data del issue en específico que ya obtuvimos, antes de que este se renderice y evitamos realizar una petición cada vez que pasemos el mouse sobre el issue en la lista.

  //* La data puede quedar desactualizada y será necesario realizar el fetch (automático al entrar en donde el issue específico se renderiza).

  //* Recibe cómo argumentos el queryKey y la función o data actualizada que va a caer en el cache.

  const preSetData = () => {
    queryClient.setQueryData(['issue', issue.number], issue);
  };

  //* el objeto de configuración con la propiedad updatedAt funciona similar al staleTime, ya que le específicamos a react query hasta qué momento la data está fresca y pasado esa fecha establecida volverá a realizar el fetch de la data.

  //* Ejemplo:

  //* 1. Realizas la petición a las 10:35pm.

  //* 2. Usando el updatedAt le agrega 1 minuto

  //* 3. La petición se mantendra en un estado de fresca hata las 10;36pm.

  //* 4. Luego la data pasa aser stale.

  const preSetDataFresh = () => {
    queryClient.setQueryData(['issue', issue.number], issue, {
      updatedAt: new Date().getTime() + 1000000,
    });
  };

  return (
    <div
      className='card mb-2 issue'
      onClick={() => navigate(`/issues/issue/${issue.number}`)}
      // onMouseEnter={preFetchData}
      onMouseEnter={preSetData}
      // onMouseEnter={preSetDataFresh}
    >
      <div className='card-body d-flex align-items-center'>
        {issue.state === 'open' ? (
          <FiInfo size={30} color='red' />
        ) : (
          <FiCheckCircle size={30} color='green' />
        )}

        <div className='d-flex flex-column flex-fill px-2'>
          <span>{issue.title}</span>
          <span className='issue-subinfo'>
            #{issue.number} opened {timeSince(issue.created_at)} ago by{' '}
            <span className='fw-bold'>{issue.user.login}</span>
          </span>

          <div>
            {issue.labels.map((label) => (
              <span
                key={label.id}
                className='badge rounded-pill m-1'
                style={{ backgroundColor: `#${label.color}`, color: 'black' }}
              >
                {label.name}
              </span>
            ))}
          </div>
        </div>

        <div className='d-flex align-items-center'>
          <img
            src={issue.user.avatar_url}
            alt={issue.user.login}
            className='avatar'
          />
          <span className='px-2'>{issue.comments}</span>
          <FiMessageSquare />
        </div>
      </div>
    </div>
  );
};

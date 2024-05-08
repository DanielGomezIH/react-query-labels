import { useQuery } from '@tanstack/react-query';
import { Label } from '../interfaces/label';
import { githubApi } from '../../api/githubApi';
import { sleep } from '../../helpers/sleep';

const getLabels = async (): Promise<Label[]> => {
  await sleep(2);
  const { data } = await githubApi.get<Label[]>('/labels?per_page=100');
  return data;
};

export const useLabels = () => {
  const labelsQuery = useQuery({
    queryKey: ['labels'],
    queryFn: getLabels,
    staleTime: 1000 * 60 * 60,
    // placeholderData: [
    //   {
    //     id: 717031390,
    //     node_id: 'MDU6TGFiZWw3MTcwMzEzOTA=',
    //     url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue',
    //     name: 'good first issue',
    //     color: '6ce26a',
    //     default: true,
    //   },
    //   {
    //     id: 6344006318,
    //     node_id: 'LA_kwDOAJy2Ks8AAAABeiHarg',
    //     url: 'https://api.github.com/repos/facebook/react/labels/fb-exported',
    //     name: 'fb-exported',
    //     color: 'ededed',
    //     default: false,
    //   },
    // ],
    // initialData: [
    //   {
    //     id: 717031390,
    //     node_id: 'MDU6TGFiZWw3MTcwMzEzOTA=',
    //     url: 'https://api.github.com/repos/facebook/react/labels/good%20first%20issue',
    //     name: 'good first issue',
    //     color: '6ce26a',
    //     default: true,
    //   },
    //   {
    //     id: 6344006318,
    //     node_id: 'LA_kwDOAJy2Ks8AAAABeiHarg',
    //     url: 'https://api.github.com/repos/facebook/react/labels/fb-exported',
    //     name: 'fb-exported',
    //     color: 'ededed',
    //     default: false,
    //   },
    // ],
    // refetchOnWindowFocus: false
  });

  return labelsQuery;
};

export default useLabels;

//* la clave queryKey del objeto es un arreglo en donde react query va almacenar en cache la data resultante de la petición al endpoint.

//* la clave queryFn del objeto tiene como valor una función asíncrona que por lo general es la petición al endpoint.

//* con staleTime le indicamos a react query el tiempo por el cual debe mantener la data FRESCA, es decir en cuanto tiempo debe volver a hacer fetch al endpoint.

//* con refetchOnWindowFocus podemos decirle a react query que haga o no la petición al endpoint cada vez que se ponga el foco en la ventana en donde está la aplicación, mediante true o false.

//* Con InitialData le decimos a react query que la data que proporcionemos en el arreglo es la última data y que confie en nosotros y la mantenga.

//* Con placeholderDats le decimos a react query que muestre la data que le proporcionamos al arreglo MIENTRAS hace el fetching al endpoint, lo cual puede mejorar la experiencia de usuario al mostrarle información al cargar.

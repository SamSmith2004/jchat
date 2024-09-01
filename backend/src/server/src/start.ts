import { server } from './index';

const PORT = 8080;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
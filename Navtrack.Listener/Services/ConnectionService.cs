using System;
using System.Net;
using System.Threading.Tasks;
using Navtrack.DataAccess.Model;
using Navtrack.DataAccess.Repository;
using Navtrack.Library.DI;

namespace Navtrack.Listener.Services
{
    [Service(typeof(IConnectionService))]
    public class ConnectionService : IConnectionService
    {
        private readonly IRepository repository;

        public ConnectionService(IRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ConnectionEntity> NewConnection(IPEndPoint ipEndPoint)
        {
            using IUnitOfWork unitOfWork = repository.CreateUnitOfWork();
            
            ConnectionEntity connection = new ConnectionEntity
            {
                OpenedAt = DateTime.UtcNow,
                RemoteEndPoint = ipEndPoint.ToString()
            };

            unitOfWork.Add(connection);

            await unitOfWork.SaveChanges();

            return connection;
        }

        public async Task MarkConnectionAsClosed(ConnectionEntity connection)
        {
            using IUnitOfWork unitOfWork = repository.CreateUnitOfWork();

            connection.ClosedAt = DateTime.UtcNow;

            unitOfWork.Update(connection);

            await unitOfWork.SaveChanges();
        }
    }
}
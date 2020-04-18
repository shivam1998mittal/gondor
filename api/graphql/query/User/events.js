import Models from 'Models';
import overlapDateTimeClause from 'Utils/overlapDateTimeClause';
import BaseConnectionResolver from 'Graphql/base/ConnectionResolver';

class UserEventsResolver extends BaseConnectionResolver {
  entity = Models.CalendarEvent;

  MAX_LIMIT = null;

  query = () => ({
    order: 'start_at',
    where: overlapDateTimeClause(this.args.dateTimeRange),
    include: [
      {
        model: Models.User,
        as: 'attendees',
        attributes: ['id'],
        through: {
          attributes: ['id'],
          where: {
            user_id: this.parent.id,
            status: {
              [Models.Sequelize.Op.in]: ['Pending', 'Accepted', 'Requested'],
            },
          },
        },
        required: true,
      },
    ],
  });
}

export default UserEventsResolver.resolver();

import { Base } from '@/core/models/Base';
import dayjs from '@/core/dayjs';

export class PlayerParentHistory extends Base<PlayerParentHistory>() {
  public updatedAt: string;

  get updatedAtFormated() {
    return dayjs(this.updatedAt).format('DD MMM, YYYY HH:mm:ss');
  }
}
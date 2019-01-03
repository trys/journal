import { h, Component } from 'preact';
import {
  ymd,
  url,
  format,
  compare,
  fudgeDates,
  filledArray,
  months as monthNames,
} from '../../utils/date';
import { DB } from '../../utils/db';
import Traverse from '../../components/Traverse';

export default class Year extends Component {
  state = {
    months: filledArray(),
  };

  componentDidMount() {
    this.getData(this.props);
  }

  componentWillReceiveProps(props) {
    this.getData(props);
  }

  getData = ({ year }) => {
    const date = new Date(year, 0, 1);

    if (date.toString() === 'Invalid Date') {
      window.location.href = `/${new Date().getFullYear()}`;
      return;
    }

    const db = new DB();
    const months = filledArray();

    db.keys('entries')
      .then(keys => keys.map(x => x.split('_').shift()))
      .then(dates => {
        dates
          .filter(x => x.indexOf(String(year)) === 0)
          .forEach(date => {
            const month = Number(date.substring(4, 6)) - 1;
            months[month]++;
          });

        this.setState({ months });
      });
  };

  render({ year }, { months }) {
    const today = new Date();
    const lastYear = new Date(year, 0, 1);
    lastYear.setFullYear(lastYear.getFullYear() - 1);

    const nextYear = new Date(year, 0, 1);
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const isThisYear = today.getFullYear() === Number(year);

    return (
      <div class="wrap wrap--padding">
        <Traverse
          title={year}
          lastLink={`/${lastYear.getFullYear()}`}
          nextLink={isThisYear ? '' : `/${nextYear.getFullYear()}`}
          disableNext={isThisYear}
        />
        <ul>
          {months.map((count, month) => (
            <li key={month}>
              {monthNames[month]} - {count} entries
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
import Contains from './Contains';
import EndsWith from './EndsWith';
import Equals from './Equals';
import Every from './Every';
import GreaterThan from './GreaterThan';
import GreaterThanEquals from './GreaterThanEquals';
import IsInside from './IsInside';
import IsNotInside from './IsNotInside';
import LessThan from './LessThan';
import LessThanEquals from './LessThanEquals';
import None from './None';
import NotContains from './NotContains';
import NotEquals from './NotEquals';
import Some from './Some';
import StartsWith from './StartsWith';

export default [
  new Every(),
  new Some(),
  new None(),
  new StartsWith(),
  new EndsWith(),
  new Equals(),
  new NotEquals(),
  new Contains(),
  new NotContains(),
  new GreaterThan(),
  new GreaterThanEquals(),
  new LessThan(),
  new LessThanEquals(),
  new IsInside(),
  new IsNotInside
];

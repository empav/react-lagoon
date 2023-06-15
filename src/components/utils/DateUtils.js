import dayjs from 'dayjs';

export const isAfter5minutes = date => {
  return dayjs().subtract(5, 'minute') > dayjs(date);
};

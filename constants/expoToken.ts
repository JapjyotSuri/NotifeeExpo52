
let notificationNav: any = null;

export const setNotificationNav = (nav: any) => {
  console.log("setting notification nav", nav);
  notificationNav = nav;
};

export const getNotificationNav = () => notificationNav;

export enum ActionType {
    INIT = "@@INIT",
    update_user = "update_user",
    user_created = "user_created",
    user_login_ok = "user_login_ok",
    user_login_fail = "user_login_fail",
    user_logout = "user_logout",
    create_asset = "create_asset",
    update_asset = "update_asset",
    delete_asset = "delete_asset",
    render_test = "render_test",
    server_called = "server_called",
    add_assets_from_server = "add_assets_from_server" 
}
export interface IAction {
    type: ActionType;
}

<?php
/**
 * Plugin Name: Tora Road Meta
 * Description: Tora Roadの記事用カスタムフィールドとDormy Inn管理機能を提供します。
 * Version: 3.0.2
 */

/**
 * ---------------------------------------------------------
 * 1. 通常の記事用メタデータ
 * ---------------------------------------------------------
 */

add_action('init', function () {

    register_post_meta('post', 'distance', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'hotel', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'road', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'food', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'map_embed_url', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'visited', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
    ]);
});


/**
 * ---------------------------------------------------------
 * 2. Dormy Inn 独自投稿タイプ
 * ---------------------------------------------------------
 */

add_action('init', function () {

    register_post_type('dormy_inn', [

        'labels' => [
            'name' => 'Dormy Inn',
            'singular_name' => 'Dormy Inn',
            'add_new' => '新規追加',
            'add_new_item' => 'Dormy Innを追加',
            'edit_item' => 'Dormy Innを編集',
            'new_item' => '新しいDormy Inn',
            'view_item' => 'Dormy Innを表示',
            'search_items' => 'Dormy Innを検索',
        ],

        'public' => true,

        'show_ui' => true,

        'show_in_menu' => true,

        'show_in_rest' => true,

        'menu_icon' => 'dashicons-building',

        'supports' => [
            'title',
            'custom-fields',
        ],

        'has_archive' => false,

        'rewrite' => false,

    ]);

});


/**
 * ---------------------------------------------------------
 * 3. Dormy Inn用メタデータ
 * ---------------------------------------------------------
 */

add_action('init', function () {

    register_post_meta('dormy_inn', 'area', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('dormy_inn', 'visited', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
    ]);

    register_post_meta('dormy_inn', 'article_slug', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

});


/**
 * ---------------------------------------------------------
 * 4. 通常記事のTora Road - Ride Data入力欄
 * ---------------------------------------------------------
 */

add_action('add_meta_boxes', function () {

    add_meta_box(
        'tora_road_ride_data',
        'Tora Road - Ride Data',
        'tora_road_render_meta_box',
        'post',
        'normal',
        'high'
    );

});


function tora_road_render_meta_box($post) {

    wp_nonce_field(
        'tora_road_save_meta',
        'tora_road_meta_nonce'
    );

    $distance = get_post_meta(
        $post->ID,
        'distance',
        true
    );

    $hotel = get_post_meta(
        $post->ID,
        'hotel',
        true
    );

    $road = get_post_meta(
        $post->ID,
        'road',
        true
    );

    $food = get_post_meta(
        $post->ID,
        'food',
        true
    );

    $map_embed_url = get_post_meta(
        $post->ID,
        'map_embed_url',
        true
    );

    $visited = get_post_meta(
        $post->ID,
        'visited',
        true
    );

    ?>

    <style>
        .tora-road-field {
            margin-bottom: 20px;
        }

        .tora-road-field label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .tora-road-field input[type="text"],
        .tora-road-field input[type="url"] {
            width: 100%;
            max-width: 700px;
        }

        .tora-road-help {
            color: #646970;
            font-size: 12px;
            margin-top: 5px;
        }
    </style>

    <div class="tora-road-field">

        <label for="tora_distance">
            走行距離
        </label>

        <input
            type="text"
            id="tora_distance"
            name="tora_distance"
            value="<?php echo esc_attr($distance); ?>"
            placeholder="例: 312 km"
        >

    </div>

    <div class="tora-road-field">

        <label for="tora_hotel">
            宿泊ホテル
        </label>

        <input
            type="text"
            id="tora_hotel"
            name="tora_hotel"
            value="<?php echo esc_attr($hotel); ?>"
            placeholder="例: ドーミーイン高崎"
        >

    </div>

    <div class="tora-road-field">

        <label for="tora_road">
            メイン道路
        </label>

        <input
            type="text"
            id="tora_road"
            name="tora_road"
            value="<?php echo esc_attr($road); ?>"
            placeholder="例: 榛名道路"
        >

    </div>

    <div class="tora-road-field">

        <label for="tora_food">
            食事
        </label>

        <input
            type="text"
            id="tora_food"
            name="tora_food"
            value="<?php echo esc_attr($food); ?>"
            placeholder="例: 水沢うどん"
        >

    </div>

    <div class="tora-road-field">

        <label for="tora_map_embed_url">
            Google Maps 埋め込みURL
        </label>

        <input
            type="url"
            id="tora_map_embed_url"
            name="tora_map_embed_url"
            value="<?php echo esc_attr($map_embed_url); ?>"
            placeholder="https://www.google.com/maps/embed?pb=..."
        >

        <p class="tora-road-help">
            iframe の src のURLだけを入力します。
        </p>

    </div>

    <div class="tora-road-field">

        <label>
            <input
                type="checkbox"
                name="tora_visited"
                value="1"
                <?php checked($visited, true); ?>
            >
            訪問済みとして扱う
        </label>

    </div>

    <?php
}


/**
 * ---------------------------------------------------------
 * 5. 通常記事メタデータ保存
 * ---------------------------------------------------------
 */

add_action('save_post_post', function ($post_id) {

    if (
        !isset($_POST['tora_road_meta_nonce']) ||
        !wp_verify_nonce(
            $_POST['tora_road_meta_nonce'],
            'tora_road_save_meta'
        )
    ) {
        return;
    }

    if (
        defined('DOING_AUTOSAVE') &&
        DOING_AUTOSAVE
    ) {
        return;
    }

    if (
        !current_user_can(
            'edit_post',
            $post_id
        )
    ) {
        return;
    }

    $fields = [
        'distance' => 'tora_distance',
        'hotel' => 'tora_hotel',
        'road' => 'tora_road',
        'food' => 'tora_food',
        'map_embed_url' => 'tora_map_embed_url',
    ];

    foreach ($fields as $meta_key => $form_key) {

        if (isset($_POST[$form_key])) {

            update_post_meta(
                $post_id,
                $meta_key,
                sanitize_text_field(
                    wp_unslash($_POST[$form_key])
                )
            );

        }
    }

    update_post_meta(
        $post_id,
        'visited',
        isset($_POST['tora_visited'])
    );

});


/**
 * ---------------------------------------------------------
 * 6. Dormy Inn専用入力欄
 * ---------------------------------------------------------
 */

add_action('add_meta_boxes', function () {

    add_meta_box(
        'tora_road_dormy_data',
        'Dormy Inn Data',
        'tora_road_render_dormy_meta_box',
        'dormy_inn',
        'normal',
        'high'
    );

});


function tora_road_render_dormy_meta_box($post) {

    wp_nonce_field(
        'tora_road_save_dormy_meta',
        'tora_road_dormy_nonce'
    );

    $area = get_post_meta(
        $post->ID,
        'area',
        true
    );

    $visited = get_post_meta(
        $post->ID,
        'visited',
        true
    );

    $article_slug = get_post_meta(
        $post->ID,
        'article_slug',
        true
    );

    ?>

    <div class="tora-road-field">

        <label for="tora_dormy_area">
            都道府県
        </label>

        <input
            type="text"
            id="tora_dormy_area"
            name="tora_dormy_area"
            value="<?php echo esc_attr($area); ?>"
            placeholder="例: 群馬"
        >

    </div>

    <div class="tora-road-field">

        <label for="tora_dormy_article_slug">
            関連記事スラッグ
        </label>

        <input
            type="text"
            id="tora_dormy_article_slug"
            name="tora_dormy_article_slug"
            value="<?php echo esc_attr($article_slug); ?>"
            placeholder="例: takasaki-haruna"
        >

        <p class="tora-road-help">
            記事URLが /touring/takasaki-haruna なら takasaki-haruna を入力します。
        </p>

    </div>

    <div class="tora-road-field">

        <label>
            <input
                type="checkbox"
                name="tora_dormy_visited"
                value="1"
                <?php checked($visited, true); ?>
            >
            訪問済み
        </label>

    </div>

    <?php
}


/**
 * ---------------------------------------------------------
 * 7. Dormy Innメタデータ保存
 * ---------------------------------------------------------
 */

add_action('save_post_dormy_inn', function ($post_id) {

    if (
        !isset($_POST['tora_road_dormy_nonce']) ||
        !wp_verify_nonce(
            $_POST['tora_road_dormy_nonce'],
            'tora_road_save_dormy_meta'
        )
    ) {
        return;
    }

    if (
        defined('DOING_AUTOSAVE') &&
        DOING_AUTOSAVE
    ) {
        return;
    }

    if (
        !current_user_can(
            'edit_post',
            $post_id
        )
    ) {
        return;
    }

    if (isset($_POST['tora_dormy_area'])) {

        update_post_meta(
            $post_id,
            'area',
            sanitize_text_field(
                wp_unslash(
                    $_POST['tora_dormy_area']
                )
            )
        );

    }

    if (isset($_POST['tora_dormy_article_slug'])) {

        update_post_meta(
            $post_id,
            'article_slug',
            sanitize_text_field(
                wp_unslash(
                    $_POST['tora_dormy_article_slug']
                )
            )
        );

    }

    update_post_meta(
        $post_id,
        'visited',
        isset($_POST['tora_dormy_visited'])
    );

});


/**
 * ---------------------------------------------------------
 * 8. 標準カスタムフィールド欄を非表示
 * ---------------------------------------------------------
 */

add_action('admin_init', function () {

    remove_meta_box(
        'postcustom',
        'post',
        'normal'
    );

    remove_meta_box(
        'postcustom',
        'dormy_inn',
        'normal'
    );

});
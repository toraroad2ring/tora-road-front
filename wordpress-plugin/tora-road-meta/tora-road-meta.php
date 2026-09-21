<?php
/**
 * Plugin Name: Tora Road Meta
 * Description: Tora Roadの記事・旅行記・ツーリング向け宿泊施設データを管理します。
 * Version: 4.0.0
 */

/**
 * ---------------------------------------------------------
 * 1. 通常記事用メタデータ
 * ---------------------------------------------------------
 */

add_action('init', function () {

    register_post_meta('post', 'journal_type', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
        'default' => 'touring',
    ]);

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

    register_post_meta('post', 'country', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'city', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'event', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'transport_type', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('post', 'transport_detail', [
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
 * 2. Stay 独自投稿タイプ
 *
 * 既存データを保持するため、
 * 内部的な投稿タイプ名 dormy_inn は変更しません。
 * ---------------------------------------------------------
 */

add_action('init', function () {

    register_post_type('dormy_inn', [

        'labels' => [
            'name' => 'Stays',
            'singular_name' => 'Stay',
            'menu_name' => 'Stays',
            'add_new' => '新規追加',
            'add_new_item' => '宿泊施設を追加',
            'edit_item' => '宿泊施設を編集',
            'new_item' => '新しい宿泊施設',
            'view_item' => '宿泊施設を表示',
            'search_items' => '宿泊施設を検索',
            'not_found' => '宿泊施設が見つかりません',
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
 * 3. Stay用メタデータ
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

    register_post_meta('dormy_inn', 'large_bath', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'boolean',
    ]);

    register_post_meta('dormy_inn', 'motorcycle_parking', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

    register_post_meta('dormy_inn', 'parking_note', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'string',
    ]);

});


/**
 * ---------------------------------------------------------
 * 4. 記事編集画面
 * ---------------------------------------------------------
 */

add_action('add_meta_boxes', function () {

    add_meta_box(
        'tora_road_journal_data',
        'Tora Road - Journal Data',
        'tora_road_render_journal_meta_box',
        'post',
        'normal',
        'high'
    );

});


function tora_road_render_journal_meta_box($post) {

    wp_nonce_field(
        'tora_road_save_meta',
        'tora_road_meta_nonce'
    );

    $journal_type = get_post_meta(
        $post->ID,
        'journal_type',
        true
    );

    if (!$journal_type) {
        $journal_type = 'touring';
    }

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

    $country = get_post_meta(
        $post->ID,
        'country',
        true
    );

    $city = get_post_meta(
        $post->ID,
        'city',
        true
    );

    $event = get_post_meta(
        $post->ID,
        'event',
        true
    );

    $transport_type = get_post_meta(
        $post->ID,
        'transport_type',
        true
    );

    $transport_detail = get_post_meta(
        $post->ID,
        'transport_detail',
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

        .tora-road-section {
            margin-bottom: 28px;
            padding-bottom: 8px;
        }

        .tora-road-section-title {
            margin-top: 0;
            margin-bottom: 18px;
            padding-bottom: 8px;
            border-bottom: 1px solid #dcdcde;
            font-size: 16px;
        }

        .tora-road-field {
            margin-bottom: 20px;
        }

        .tora-road-field label {
            display: block;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .tora-road-field input[type="text"],
        .tora-road-field input[type="url"],
        .tora-road-field select,
        .tora-road-field textarea {
            width: 100%;
            max-width: 700px;
        }

        .tora-road-field textarea {
            min-height: 90px;
        }

        .tora-road-help {
            color: #646970;
            font-size: 12px;
            margin-top: 5px;
        }

        .tora-road-type-select {
            max-width: 300px !important;
            font-weight: 600;
        }

    </style>


    <div class="tora-road-section">

        <h3 class="tora-road-section-title">
            JOURNAL TYPE
        </h3>

        <div class="tora-road-field">

            <label for="tora_journal_type">
                記事種別
            </label>

            <select
                id="tora_journal_type"
                name="tora_journal_type"
                class="tora-road-type-select"
            >

                <option
                    value="touring"
                    <?php selected($journal_type, 'touring'); ?>
                >
                    TOURING - バイク旅
                </option>

                <option
                    value="travel"
                    <?php selected($journal_type, 'travel'); ?>
                >
                    TRAVEL - 電車・飛行機などの旅
                </option>

            </select>

            <p class="tora-road-help">
                既存記事や未設定の記事はTOURINGとして扱います。
            </p>

        </div>

    </div>


    <div
        id="tora-touring-fields"
        class="tora-road-section"
    >

        <h3 class="tora-road-section-title">
            TOURING DATA
        </h3>

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

    </div>


    <div
        id="tora-travel-fields"
        class="tora-road-section"
    >

        <h3 class="tora-road-section-title">
            TRAVEL DATA
        </h3>

        <div class="tora-road-field">

            <label for="tora_country">
                国
            </label>

            <input
                type="text"
                id="tora_country"
                name="tora_country"
                value="<?php echo esc_attr($country); ?>"
                placeholder="例: USA"
            >

        </div>


        <div class="tora-road-field">

            <label for="tora_city">
                都市・地域
            </label>

            <input
                type="text"
                id="tora_city"
                name="tora_city"
                value="<?php echo esc_attr($city); ?>"
                placeholder="例: Las Vegas"
            >

        </div>


        <div class="tora-road-field">

            <label for="tora_event">
                イベント・目的
            </label>

            <input
                type="text"
                id="tora_event"
                name="tora_event"
                value="<?php echo esc_attr($event); ?>"
                placeholder="例: Black Hat USA / DEF CON"
            >

        </div>


        <div class="tora-road-field">

            <label for="tora_transport_type">
                主な移動手段
            </label>

            <select
                id="tora_transport_type"
                name="tora_transport_type"
            >

                <option value="">
                    選択してください
                </option>

                <option
                    value="flight"
                    <?php selected($transport_type, 'flight'); ?>
                >
                    飛行機
                </option>

                <option
                    value="train"
                    <?php selected($transport_type, 'train'); ?>
                >
                    電車・新幹線
                </option>

                <option
                    value="car"
                    <?php selected($transport_type, 'car'); ?>
                >
                    車・レンタカー
                </option>

                <option
                    value="bus"
                    <?php selected($transport_type, 'bus'); ?>
                >
                    バス
                </option>

                <option
                    value="ferry"
                    <?php selected($transport_type, 'ferry'); ?>
                >
                    フェリー
                </option>

                <option
                    value="other"
                    <?php selected($transport_type, 'other'); ?>
                >
                    その他
                </option>

            </select>

        </div>


        <div class="tora-road-field">

            <label for="tora_transport_detail">
                移動手段詳細
            </label>

            <input
                type="text"
                id="tora_transport_detail"
                name="tora_transport_detail"
                value="<?php echo esc_attr($transport_detail); ?>"
                placeholder="例: United Airlines / Denver transit"
            >

            <p class="tora-road-help">
                例：北陸新幹線、特急あずさ、飛行機＋レンタカーなど。
            </p>

        </div>

    </div>


    <div class="tora-road-section">

        <h3 class="tora-road-section-title">
            COMMON DATA
        </h3>


        <div class="tora-road-field">

            <label for="tora_hotel">
                宿泊先
            </label>

            <input
                type="text"
                id="tora_hotel"
                name="tora_hotel"
                value="<?php echo esc_attr($hotel); ?>"
                placeholder="例: ドーミーイン高崎"
            >

            <p class="tora-road-help">
                日帰りの場合は空欄でOKです。
            </p>

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

    </div>


    <script>

        document.addEventListener('DOMContentLoaded', function () {

            const journalType =
                document.getElementById('tora_journal_type');

            const touringFields =
                document.getElementById('tora-touring-fields');

            const travelFields =
                document.getElementById('tora-travel-fields');

            function updateJournalFields() {

                if (!journalType) {
                    return;
                }

                if (journalType.value === 'travel') {

                    touringFields.style.display = 'none';
                    travelFields.style.display = 'block';

                } else {

                    touringFields.style.display = 'block';
                    travelFields.style.display = 'none';

                }

            }

            journalType.addEventListener(
                'change',
                updateJournalFields
            );

            updateJournalFields();

        });

    </script>

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
            sanitize_text_field(
                wp_unslash($_POST['tora_road_meta_nonce'])
            ),
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


    $journal_type = 'touring';

    if (
        isset($_POST['tora_journal_type']) &&
        $_POST['tora_journal_type'] === 'travel'
    ) {
        $journal_type = 'travel';
    }

    update_post_meta(
        $post_id,
        'journal_type',
        $journal_type
    );


    $text_fields = [
        'distance' => 'tora_distance',
        'hotel' => 'tora_hotel',
        'road' => 'tora_road',
        'food' => 'tora_food',
        'country' => 'tora_country',
        'city' => 'tora_city',
        'event' => 'tora_event',
        'transport_detail' => 'tora_transport_detail',
    ];


    foreach ($text_fields as $meta_key => $form_key) {

        if (isset($_POST[$form_key])) {

            update_post_meta(
                $post_id,
                $meta_key,
                sanitize_text_field(
                    wp_unslash(
                        $_POST[$form_key]
                    )
                )
            );

        }

    }


    $allowed_transport_types = [
        '',
        'flight',
        'train',
        'car',
        'bus',
        'ferry',
        'other',
    ];

    $transport_type = '';

    if (isset($_POST['tora_transport_type'])) {

        $candidate = sanitize_text_field(
            wp_unslash(
                $_POST['tora_transport_type']
            )
        );

        if (
            in_array(
                $candidate,
                $allowed_transport_types,
                true
            )
        ) {
            $transport_type = $candidate;
        }

    }

    update_post_meta(
        $post_id,
        'transport_type',
        $transport_type
    );


    if (isset($_POST['tora_map_embed_url'])) {

        update_post_meta(
            $post_id,
            'map_embed_url',
            esc_url_raw(
                wp_unslash(
                    $_POST['tora_map_embed_url']
                )
            )
        );

    }


    update_post_meta(
        $post_id,
        'visited',
        isset($_POST['tora_visited'])
    );

});


/**
 * ---------------------------------------------------------
 * 6. Stay専用入力欄
 * ---------------------------------------------------------
 */

add_action('add_meta_boxes', function () {

    add_meta_box(
        'tora_road_stay_data',
        'Tora Road - Stay Data',
        'tora_road_render_stay_meta_box',
        'dormy_inn',
        'normal',
        'high'
    );

});


function tora_road_render_stay_meta_box($post) {

    wp_nonce_field(
        'tora_road_save_stay_meta',
        'tora_road_stay_nonce'
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

    $large_bath = get_post_meta(
        $post->ID,
        'large_bath',
        true
    );

    $motorcycle_parking = get_post_meta(
        $post->ID,
        'motorcycle_parking',
        true
    );

    $parking_note = get_post_meta(
        $post->ID,
        'parking_note',
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
        .tora-road-field select,
        .tora-road-field textarea {
            width: 100%;
            max-width: 700px;
        }

        .tora-road-field textarea {
            min-height: 100px;
        }

        .tora-road-help {
            color: #646970;
            font-size: 12px;
            margin-top: 5px;
        }

    </style>


    <div class="tora-road-field">

        <label for="tora_stay_area">
            都道府県・地域
        </label>

        <input
            type="text"
            id="tora_stay_area"
            name="tora_stay_area"
            value="<?php echo esc_attr($area); ?>"
            placeholder="例: 群馬"
        >

    </div>


    <div class="tora-road-field">

        <label>
            大浴場
        </label>

        <label>

            <input
                type="checkbox"
                name="tora_stay_large_bath"
                value="1"
                <?php checked($large_bath, true); ?>
            >

            大浴場あり

        </label>

    </div>


    <div class="tora-road-field">

        <label for="tora_stay_motorcycle_parking">
            バイク駐車
        </label>

        <select
            id="tora_stay_motorcycle_parking"
            name="tora_stay_motorcycle_parking"
        >

            <option
                value="unknown"
                <?php selected($motorcycle_parking, 'unknown'); ?>
            >
                不明
            </option>

            <option
                value="good"
                <?php selected($motorcycle_parking, 'good'); ?>
            >
                ○ バイク向け
            </option>

            <option
                value="conditional"
                <?php selected($motorcycle_parking, 'conditional'); ?>
            >
                △ 条件付き
            </option>

            <option
                value="unavailable"
                <?php selected($motorcycle_parking, 'unavailable'); ?>
            >
                × 駐車不可
            </option>

        </select>

    </div>


    <div class="tora-road-field">

        <label for="tora_stay_parking_note">
            バイク駐車メモ
        </label>

        <textarea
            id="tora_stay_parking_note"
            name="tora_stay_parking_note"
            placeholder="例: 従業員用駐輪場。屋根なし、防犯カメラなし。"
        ><?php echo esc_textarea($parking_note); ?></textarea>

    </div>


    <div class="tora-road-field">

        <label for="tora_stay_article_slug">
            関連記事スラッグ
        </label>

        <input
            type="text"
            id="tora_stay_article_slug"
            name="tora_stay_article_slug"
            value="<?php echo esc_attr($article_slug); ?>"
            placeholder="例: takasaki-haruna"
        >

        <p class="tora-road-help">
            touring / travel どちらの記事でも、記事のslugだけを入力します。
        </p>

    </div>


    <div class="tora-road-field">

        <label>

            <input
                type="checkbox"
                name="tora_stay_visited"
                value="1"
                <?php checked($visited, true); ?>
            >

            宿泊済み

        </label>

    </div>

    <?php
}


/**
 * ---------------------------------------------------------
 * 7. Stayメタデータ保存
 * ---------------------------------------------------------
 */

add_action('save_post_dormy_inn', function ($post_id) {

    if (
        !isset($_POST['tora_road_stay_nonce']) ||
        !wp_verify_nonce(
            sanitize_text_field(
                wp_unslash($_POST['tora_road_stay_nonce'])
            ),
            'tora_road_save_stay_meta'
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


    $text_fields = [
        'area' => 'tora_stay_area',
        'article_slug' => 'tora_stay_article_slug',
        'parking_note' => 'tora_stay_parking_note',
    ];


    foreach ($text_fields as $meta_key => $form_key) {

        if (isset($_POST[$form_key])) {

            update_post_meta(
                $post_id,
                $meta_key,
                sanitize_textarea_field(
                    wp_unslash(
                        $_POST[$form_key]
                    )
                )
            );

        }

    }


    $allowed_parking_values = [
        'unknown',
        'good',
        'conditional',
        'unavailable',
    ];

    $motorcycle_parking = 'unknown';

    if (isset($_POST['tora_stay_motorcycle_parking'])) {

        $candidate = sanitize_text_field(
            wp_unslash(
                $_POST['tora_stay_motorcycle_parking']
            )
        );

        if (
            in_array(
                $candidate,
                $allowed_parking_values,
                true
            )
        ) {
            $motorcycle_parking = $candidate;
        }

    }

    update_post_meta(
        $post_id,
        'motorcycle_parking',
        $motorcycle_parking
    );


    update_post_meta(
        $post_id,
        'large_bath',
        isset($_POST['tora_stay_large_bath'])
    );


    update_post_meta(
        $post_id,
        'visited',
        isset($_POST['tora_stay_visited'])
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